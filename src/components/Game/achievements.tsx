import React from "react";
import type {achievementInterfaceType,EarnedAchievementsType} from "@type/game.types";
import {useParams} from "react-router-dom";

import getAchievements from "../../helpers/getAchievements";
import {getFromStorage} from "../../helpers/getFromStorage";

import achStyles from './achievements.module.scss'
import styles from './game.module.scss';

type ExtendedAchievementType = EarnedAchievementsType[0] & {
    progress: number
    className: string
    image: string
    body: string
}

const Achievements = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const initialAchievements = getFromStorage('achievements')[id] || {};
    const [achievements, setAchievements] = React.useState(initialAchievements);
    const externalProgress = (getFromStorage('progress') || {})[id] || {};
    const stats = getFromStorage('stats')[id] || {};
    const {alternativeAchievementsView: alternative} = getFromStorage('config').settings;

    React.useEffect(() => {
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

    const getItemClassName = (name: string, type: string) => {
        const stylesArray = [];
        if (Object.hasOwn(achievements, name) && achievements[name].earned) {
            if (alternative) stylesArray.push(achStyles.earned);
            else stylesArray.push(styles.earned);
        }
        if (type) stylesArray.push(styles['ach_' + type]);
        return stylesArray.join(' ')
    }

    const addEarnedInfo = ({
                               name,
                               type,
                               icongray,
                               icon,
                               hiddenDescription,
                               description,
                               hidden
                           }: achievementInterfaceType): ExtendedAchievementType => {
        const className = getItemClassName(name, type);
        if (!Object.hasOwn(achievements, name)) return {
            ...achievements[name],
            body: hidden ? hiddenDescription : description,
            className,
            image: icongray,
            progress: 0
        }

        return {
            ...achievements[name],
            body: description,
            className,
            image: achievements[name].earned ? icon : icongray,
            progress: achievements[name].progress || 0
        }
    }

    const getStyle = (progress: number): React.CSSProperties & {'--progress': string} => ({
        '--progress': `${100 - (progress * 100)}%`
    })

    const renderItem = (
        {
            name,
            image,
            displayName,
            className,
            progress,
            xp,
            earned_time,
            body,
            rarity
        }: ExtendedAchievementType & achievementInterfaceType,
    ) => (
        <li key={name}
            className={className}
            style={getStyle(progress)}
        >
            <img src={image} alt={name}/>
            <div>
                <strong>{displayName}</strong>
                <span>{body}</span>
                {Boolean(earned_time) && <i>{new Date(earned_time * 1000).toLocaleDateString()}</i>}
                {Boolean(progress && progress !== 1) && <i>{Math.floor(progress * 100)}%</i>}
                {externalProgress[name] && <i>Progress: {externalProgress[name]}</i>}
                <div className={styles.additional}>
                    {typeof xp === "number" && <small>{xp} XP</small>}
                    {typeof rarity === "number" && <small>Rarity: {rarity}%</small>}
                </div>
            </div>
        </li>)

    const renderAchievementItems = () => {
        const orderMap = new Map();
        Object.entries(achievements)
            .sort(([_, {earned_time}], [_2, {earned_time: earned_timePrev}]) => {
                if (!earned_time) return 1;
                if (!earned_timePrev) return -1;
                return new Date(earned_timePrev).getTime() - new Date(earned_time).getTime()
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

        return (
            <ul className={alternative ? achStyles.achList : styles.achList}>
                {game.achievements.sort(sort).map(item => ({...item, ...addEarnedInfo(item)})).map(renderItem)}
            </ul>
        )

    }

    return (
        <div className={styles.achWrapper}>
            {renderStats()}
            {renderAchievementItems()}
        </div>
    )
}

export default Achievements;