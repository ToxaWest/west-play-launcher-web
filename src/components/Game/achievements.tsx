import React from "react";
import type {achievementInterfaceType, EarnedAchievementsType} from "@type/game.types";
import {useParams} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import getAchievements from "../../helpers/getAchievements";
import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";
import Modal from "../Modal";

import styles from './game.module.scss';

type ExtendedAchievementType = EarnedAchievementsType[0] & {
    progress: number
    className: string
    image: string
    body: string
    screenshot?: { name: string, path: string }
}

const Achievements = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const initialAchievements = getFromStorage('achievements')[id] || {};
    const [achievements, setAchievements] = React.useState(initialAchievements);
    const externalProgress = (getFromStorage('progress') || {})[id] || {};
    const stats = getFromStorage('stats')[id] || {};
    const [images, setImages] = React.useState<{ name: string, path: string }[]>([])
    const [activeScreenshot, setActiveScreenshot] = React.useState<{ name: string, path: string, displayName: string } | null>(null)

    React.useEffect(() => {
        electronConnector.getAchievementScreenshots(game.name).then(setImages)
        getAchievements(id, setAchievements)
    }, []);

    const renderStats = () => {
        if (!game.stats || !stats) return null
        const renderStats = ([key, value]) => {
            if (!value) return null;
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
        if (Object.hasOwn(achievements, name) && achievements[name].earned) stylesArray.push(styles.earned);
        if (type) stylesArray.push(styles['ach_' + type]);
        return stylesArray.join(' ')
    }

    const addEarnedInfo = ({
                               name,
                               type,
                               icongray,
                               icon,
                               description,
                               hidden
                           }: achievementInterfaceType): ExtendedAchievementType => {
        const className = getItemClassName(name, type);
        if (!Object.hasOwn(achievements, name)) return {
            ...achievements[name],
            body: hidden ? i18n.t('Hidden achievement') : description,
            className,
            image: icongray,
            progress: 0
        }

        const screenshot = images.find(({name: imgName}) => imgName === name)

        return {
            ...achievements[name],
            body: description,
            className,
            image: achievements[name].earned ? icon : icongray,
            progress: achievements[name].progress || 0,
            screenshot
        }
    }

    const getStyle = (progress: number): React.CSSProperties & { '--progress': string } => ({
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
            description,
            screenshot,
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
                {screenshot ? <span className={styles.screenshotIcon}
                                    tabIndex={1}
                                    role="button"
                                    onClick={() => {
                                        setActiveScreenshot({...screenshot, displayName})
                                    }}
                >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="var(--theme-text-color-seconary)">
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M3 8H2V4.5A2.5 2.5 0 0 1 4.5 2H8v1H4.5A1.5 1.5 0 0 0 3 4.5zm1.5 14A1.5 1.5 0 0 1 3 20.5V17H2v3.5A2.5 2.5 0 0 0 4.5 23H8v-1zM22 20.5a1.5 1.5 0 0 1-1.5 1.5H17v1h3.5a2.5 2.5 0 0 0 2.5-2.5V17h-1zM20.5 2H17v1h3.5A1.5 1.5 0 0 1 22 4.5V8h1V4.5A2.5 2.5 0 0 0 20.5 2zM14 7h4v4h1V6h-5zm-7 4V7h4V6H6v5zm11 3v4h-4v1h5v-5zm-7 4H7v-4H6v5h5z"></path>
                            <path fill="none" d="M0 0h24v24H0z"></path>
                        </g>
                    </svg>
                </span> : null}
                <strong>{displayName}</strong>
                <span title={description}>{body}</span>
                {Boolean(earned_time) && <i>{new Date(earned_time * 1000).toLocaleDateString()}</i>}
                {Boolean(progress && progress !== 1) && <i>{Math.floor(progress * 100)}%</i>}
                {externalProgress[name] && <i>{i18n.t('Progress')}: {externalProgress[name]}</i>}
                <div className={styles.additional}>
                    {typeof xp === "number" && <small>{xp} XP</small>}
                    {typeof rarity === "number" && <small>{i18n.t('Rarity')}: {rarity}%</small>}
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
            if (!orderMap.has(name)) orderMap.set(name, orderMap.size + 1);
        })

        game.achievements.sort((a, b) => a.rarity > b.rarity ? -1 : 1)
            .forEach(({name}) => {
                if (!orderMap.has(name)) orderMap.set(name, orderMap.size + 1);
            })

        const sort = (a: achievementInterfaceType, b: achievementInterfaceType) => {
            const orderA = orderMap.get(a.name);
            const orderB = orderMap.get(b.name);
            if (typeof orderA === 'undefined') return 1;
            if (typeof orderB === 'undefined') return -1;
            return orderA - orderB;
        }

        return (
            <ul className={styles.achList}>
                {game.achievements.sort(sort).map(item => ({...item, ...addEarnedInfo(item)})).map(renderItem)}
            </ul>
        )

    }

    return (
        <div className={styles.achWrapper}>
            {renderStats()}
            {renderAchievementItems()}
            {activeScreenshot ? <Modal onClose={() => setActiveScreenshot(null)}>
                <div style={{
                    backgroundColor: 'var(--theme-color)',
                    height: '100%',
                    overflow: 'auto',
                    padding: '1vh 10vw',
                    width: '100%',
                }}>
                    <h2 style={{
                        borderBottom: '2px solid var(--theme-text-color-seconary)',
                        paddingBottom: 'var(--gap-half)',
                        textAlign: 'center'
                    }}>{activeScreenshot.displayName}</h2>
                    <img src={activeScreenshot.path} alt={activeScreenshot.displayName} style={{
                        border: '1px solid var(--theme-text-color-seconary)',
                        borderRadius: 'var(--border-radius)',
                        maxWidth: '100%'
                    }}/>
                </div>
            </Modal> : null}
        </div>
    )
}

export default Achievements;