import {useParams} from "react-router-dom";
import styles from './game.module.scss';
import achStyles from './achievements.module.scss'
import {getFromStorage} from "../../helpers/getFromStorage";
import {useEffect, useState} from "react";
import getAchievements from "../../helpers/getAchievements";

const Achievements = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const [achievements, setAchievements] = useState(getFromStorage('achievements')[id] || {});
    const externalProgress = (getFromStorage('progress') || {})[id] || {};
    const stats = getFromStorage('stats')[id] || {};
    const {alternativeAchievementsView: alternative} = getFromStorage('config').settings;

    useEffect(() => {
        getAchievements(id, setAchievements)
    }, []);

    const renderStats = () => {
        if (!game.stats || !stats) return null
        const renderStats = ([key, value]) => {
            const statInterface = game.stats.find(({name}) => name === key)
            if (!statInterface || !statInterface.displayName) return null;
            return <li key={key}>
                <div><strong>{statInterface.displayName}: {value}</strong></div>
            </li>
        }

        return (
            <ul className={styles.achList}>
                {Object.entries(stats).map(renderStats)}
            </ul>
        )
    }

    const getItemClassName = (name, type) => {
        const stylesArray = [];
        if (achievements.hasOwnProperty(name) && achievements[name].earned) {
            if (alternative) stylesArray.push(achStyles.earned);
            else stylesArray.push(styles.earned);
        }
        if (type) stylesArray.push(styles['ach_' + type]);
        return stylesArray.join(' ')
    }

    const addEarnedInfo = ({name, type, icongray, icon}) => {
        const className = getItemClassName(name, type);
        if (!achievements.hasOwnProperty(name)) return {
            progress: 0,
            className,
            image: icongray
        }

        return {
            ...achievements[name],
            progress: achievements[name].progress || 0,
            image: icon,
            className
        }
    }

    const renderAchievementItems = () => {
        const orderMap = new Map();
        Object.entries(achievements)
            .sort(([_, {earned_time}], [_2, {earned_time: earned_timePrev}]) => {
                if (!earned_time) return 1;
                if (!earned_timePrev) return -1;
                return new Date(earned_timePrev) - new Date(earned_time)
            })
            .forEach(([item], index) => {
                orderMap.set(item, index)
            })

        Object.entries(externalProgress).forEach(([name]) => {
            if (!orderMap.has(name)) {
                orderMap.set(name, orderMap.size + 1);
            }
        })

        const sort = (a, b) => {
            const orderA = orderMap.get(a.name);
            const orderB = orderMap.get(b.name);
            if (typeof orderA === 'undefined') return 1;
            if (typeof orderB === 'undefined') return -1;
            return orderA - orderB;
        }

        return (<ul className={alternative ? achStyles.achList : styles.achList}>
            {game.achievements
                .sort(sort)
                .map(item => ({...item, ...addEarnedInfo(item)}))
                .map(({name, image, displayName, description, className, progress, xp, earned_time}) => (
                    <li key={name}
                        className={className}
                        style={{'--progress': `${100 - (progress * 100)}%`}}
                    >
                        <img src={image} alt={name}/>
                        <div>
                            <strong>{displayName}</strong>
                            <span>{description}</span>
                            {earned_time ?
                                <i>{new Date(earned_time * 1000).toLocaleDateString()}</i> : null}
                            {(progress && progress !== 1) ?
                                <i>{Math.floor(progress * 100)}%</i> : null}
                            {externalProgress[name] && <i>Progress: {externalProgress[name]}</i>}

                            {xp ? <small>{xp} XP</small> : null}
                        </div>
                    </li>
                ))}
        </ul>)

    }

    return (
        <div className={styles.achWrapper}>
            {renderStats()}
            {renderAchievementItems()}
        </div>
    )
}

export default Achievements;