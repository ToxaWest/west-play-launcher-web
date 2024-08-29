import {useParams} from "react-router-dom";
import styles from './game.module.scss';
import {getFromStorage} from "../../helpers/getFromStorage";

const Achievements = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const achievements = getFromStorage('achievements')[parseInt(id)];

    if (!game.achievements) return (
        <h2 align="center">Achievements not allowed</h2>
    );

    const renderTemp = (arr) => {
        return (
            arr.map((achievement) => (
                <li key={achievement.name}>
                    <img src={achievement.icongray} alt={achievement.name}/>
                    <div>
                        <strong>{achievement.displayName}</strong>
                        <span>{achievement.description}</span>
                    </div>
                </li>
            ))
        )
    }

    const renderWithEarned = (arr, ach) => {
        const _earned = {};
        const earnedList = [];
        Object.entries(ach).forEach(([key, value]) => {
            if (value.earned) {
                _earned[key] = value;
                earnedList.push(key)
            }
        })
        const getObj = (n) => {
            return arr.find(({name}) => name.toString() === n) || {}
        }

        const sort = ([_, {earned_time}], [_2, {earned_time: earned_timePrev}]) => earned_time > earned_timePrev ? -1 : 1

        return (
            <>
                {Object.entries(_earned)
                    .sort(sort)
                    .map(([n, {earned, earned_time}]) => {
                        const {icon, displayName, description, name, type} = getObj(n);
                        if (!name) {
                            return null
                        }
                        return (
                            <li key={n}
                                className={(earned ? styles.earned : '') + (type ? ' ' + styles['ach_' + type] : '')}>
                                <img src={icon} alt={n}/>
                                <div>
                                    <strong>{displayName}</strong>
                                    <span>{description}</span>
                                    {earned_time ?
                                        <i>{new Date(earned_time * 1000).toLocaleDateString("en-US")}</i> : null}
                                </div>
                            </li>
                        )
                    })}
                {renderTemp(arr.filter(({name}) => !earnedList.includes(name)))}
            </>

        )
    }

    return (
        <div className={styles.achWrapper}>
            <ul className={styles.achList}>
                {achievements ? renderWithEarned(game.achievements, achievements) : renderTemp(game.achievements)}
            </ul>
        </div>
    )
}

export default Achievements;