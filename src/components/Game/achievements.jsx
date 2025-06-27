import {useParams} from "react-router-dom";
import styles from './game.module.scss';
import achStyles from './achievements.module.scss'
import {getFromStorage} from "../../helpers/getFromStorage";
import {useEffect, useState} from "react";
import getAchievements from "../../helpers/getAchievements";

const Achievements = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid == id);
    const [achievements, setAchievements] = useState(getFromStorage('achievements')[id]);
    const progress = (getFromStorage('progress') || {})[id] || {};
    const stats = getFromStorage('stats')[id] || {};
    const {alternativeAchievementsView: alternative} = getFromStorage('config').settings;

    useEffect(() => {
        getAchievements(id, setAchievements)
    }, []);

    if (!game.achievements) return (
        <h2 align="center">Achievements not allowed</h2>
    );

    const renderTemp = (arr) => arr.map((achievement) => (
        <li key={achievement.name}>
            <img src={achievement.icongray} alt={achievement.name}/>
            <div>
                <strong>{achievement.displayName}</strong>
                <span>{achievement.description}</span>
                {stats['stat_' + achievement.name] && <i>Progress: {stats['stat_' + achievement.name]}</i>}
                {progress[achievement.name] && <i>Progress: {progress[achievement.name]}</i>}
            </div>
        </li>
    ))


    const renderWithEarned = (arr, ach) => {
        const earnedList = Object.keys(ach);
        const getObj = (n) => arr.find(({name}) => name.toString() === n) || {}
        const sort = ([_, {earned_time}], [_2, {earned_time: earned_timePrev}]) => new Date(earned_timePrev) - new Date(earned_time)
        const notEarnedFilter = ({name}) => !earnedList.includes(name.toString());
        return (
            <>
                {Object.entries(ach).sort(sort).map(([n, {earned_time, progress, xp}]) => {
                    const {icon, displayName, description, name, type} = getObj(n);
                    if (!name) {
                        return null
                    }
                    return (
                        <li key={n}
                            style={{'--progress': `${100 - (progress * 100)}%`}}
                            className={(alternative ? achStyles.earned : styles.earned) + (type ? ' ' + styles['ach_' + type] : '')}>
                            <img src={icon} alt={n}/>
                            <div>
                                <strong>{displayName}</strong>
                                <span>{description}</span>
                                {earned_time ?
                                    <i>{new Date(earned_time * 1000).toLocaleDateString()}</i> : null}
                                {(progress && progress !== 1) ?
                                    <i>{Math.floor(progress * 100)}%</i> : null}
                                {xp ? <small>{xp} XP</small> : null}
                            </div>
                        </li>
                    )
                })}
                {renderTemp(arr.filter(notEarnedFilter))}
            </>
        )
    }

    const renderStats = () => {
        if (!game.stats || !stats) return null
        const renderStats = (s) => {
            if (!s.displayName || !stats[s.name]) {
                return null
            }
            return <li key={s.name}>
                <div>
                    <strong>{s.displayName}: {stats[s.name] || s.defaultvalue}</strong>
                </div>
            </li>
        }

        return (
            <ul className={styles.achList}>
                {game.stats.map(renderStats)}
            </ul>
        )
    }

    return (
        <div className={styles.achWrapper}>
            {renderStats()}
            <ul className={alternative ? achStyles.achList : styles.achList}>
                {achievements ? renderWithEarned(game.achievements, achievements) : renderTemp(game.achievements)}
            </ul>
        </div>
    )
}

export default Achievements;