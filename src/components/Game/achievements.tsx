import React from "react";
import type {achievementInterfaceType, EarnedAchievementsType} from "@type/game.types";
import {useParams} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import getAchievements from "../../helpers/getAchievements";
import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";
import Modal from "../Modal";

type ExtendedAchievementType = EarnedAchievementsType[0] & {
    externalProgressValue: number,
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
    const [activeScreenshot, setActiveScreenshot] = React.useState<{
        name: string,
        path: string,
        displayName: string
    } | null>(null)

    React.useEffect(() => {
        electronConnector.getAchievementScreenshots(game.name).then(setImages)
        if (!game.archive) getAchievements(id, setAchievements)
    }, []);

    const renderStats = () => {
        if (!game.stats || !stats) return null
        const renderStatItem = ([key, value]) => {
            if (!value) return null;
            const statInterface = game.stats.find(({name}) => name === key)
            if (!statInterface || !statInterface.displayName) return null;
            if (game.achievements.some(({displayName}) => displayName === statInterface.displayName)) return null;
            return <li key={key} className="bg-theme-transparent flex m-0 rounded-r-theme relative border border-secondary">
                <div className="p-gap-half flex flex-col gap-0.5 w-full relative"><strong>{statInterface.displayName}: {value}</strong></div>
            </li>
        }

        return (
            <ul className="rounded-theme w-[90vw] mx-auto my-gap grid gap-gap grid-cols-3 p-gap glass list-none empty:hidden">
                {Object.entries(stats).map(renderStatItem)}
            </ul>
        )
    }

    const addEarnedInfo = ({
                               name,
                               type,
                               icongray,
                               icon,
                               description,
                               hidden,
                               displayName
                           }: achievementInterfaceType): ExtendedAchievementType => {
        let externalProgressValue = 0;
        if (externalProgress[name] && externalProgress[name] !== 1) externalProgressValue = externalProgress[name];

        try {
            if (game.stats && stats) {
                const currentStat = game.stats.find(({displayName: statDisplayName, name: statName}) => {
                    if (statName.replace('ach_s', '') === name) return true;
                    return statDisplayName === displayName
                });
                if (currentStat) externalProgressValue = Number(stats[currentStat.name]) || Number(stats[currentStat.name.toUpperCase()]) || 0;
            }
        } catch (e) {
            console.error(e)
        }
        
        const isEarned = Object.hasOwn(achievements, name) && achievements[name].earned;
        const className = `${isEarned ? 'bg-theme! [&_strong]:text-earned' : 'bg-theme-transparent'} ${type === 'B' ? '[&_img]:bg-[#CD7F32]' : type === 'P' ? '[&_img]:bg-[#E5E4E2]' : type === 'G' ? '[&_img]:bg-[#FFD700]' : type === 'S' ? '[&_img]:bg-[#C0C0C0]' : ''}`;

        if (!Object.hasOwn(achievements, name)) return {
            ...achievements[name],
            body: hidden ? i18n.t('Hidden achievement') : description,
            className,
            externalProgressValue,
            image: icongray,
            progress: 0
        }

        const screenshot = images.find(({name: imgName}) => imgName === name)

        return {
            ...achievements[name],
            body: description,
            className,
            externalProgressValue,
            image: achievements[name].earned ? icon : icongray,
            progress: achievements[name].progress || 0,
            screenshot
        }
    }

    const getStyle = (progress: number, rarity: number): React.CSSProperties & {
        '--progress': string,
        '--rarity': string
    } => ({
        '--progress': `${100 - (progress * 100)}%`,
        '--rarity': `${rarity}%`
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
            rarity,
            externalProgressValue
        }: ExtendedAchievementType & achievementInterfaceType,
    ) => (
        <li key={name}
            className={`flex m-0 rounded-r-theme relative border border-secondary after:content-[''] after:absolute after:top-[-1px] after:left-0 after:w-[calc(100%-var(--progress))] after:h-[3px] after:opacity-80 after:bg-[#00b100] after:z-[3] ${className}`}
            style={getStyle(progress, rarity)}
        >
            <img src={image} alt={name} loading={"lazy"} className="w-[125px] h-[125px] p-[3px] aspect-square"/>
            <div className="p-gap-half flex flex-col gap-[2px] w-full relative">
                {screenshot ? <span className="absolute bottom-0 right-0 p-[2px] z-[3] outline-none cursor-pointer rounded-theme hover:bg-text-secondary active:bg-text-secondary focus:bg-text-secondary h-7 overflow-hidden [&_svg]:w-6 [&_svg]:h-6 hover:[&_svg]:invert focus:[&_svg]:invert active:[&_svg]:invert"
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
                <strong className="block">{displayName}</strong>
                <span title={description} className="block text-[15px] text-text-secondary">{body}</span>
                <div className="flex flex-col w-full text-text gap-0.5 mt-auto">
                    {typeof xp === "number" && <small>{xp} XP</small>}
                    {externalProgressValue !== 0 && <small>{i18n.t('Progress')}: {externalProgressValue}</small>}
                    {Boolean(earned_time) &&
                        <small>{new Date(earned_time * 1000).toLocaleDateString()} - {new Date(earned_time * 1000).toLocaleTimeString()}</small>}
                </div>
                <div className="absolute inset-0 bg-text opacity-[0.07] z-1 w-(--rarity) pointer-events-none"></div>
            </div>
        </li>)

    const renderAchievementItems = () => {
        const orderMap = new Map();
        const setOrder = ([item]: [string, any]) => {
            if (!orderMap.has(item)) orderMap.set(item, orderMap.size + 1)
        }
        Object.entries(achievements)
            .filter(([, {earned, earned_time}]) => earned && earned_time)
            .sort(([, {earned_time}], [, {earned_time: earned_timePrev}]) => new Date(earned_timePrev).getTime() - new Date(earned_time).getTime())
            .forEach(setOrder)
        Object.entries(achievements)
            .filter(([, {earned, progress}]) => !earned && progress)
            .sort(([, {progress}], [, {progress: progressPrev}]) => progress < progressPrev ? 1 : -1)
            .forEach(setOrder)

        Object.entries(externalProgress).forEach(setOrder)

        Object.entries(externalProgress).forEach(([name]) => {
            if (!orderMap.has(name)) orderMap.set(name, orderMap.size + 1);
        })

        game.achievements.sort((a, b) => a.rarity > b.rarity ? -1 : 1)
            .forEach(({name}) => {
                setOrder([name, null])
            })

        const sort = (a: achievementInterfaceType, b: achievementInterfaceType) => {
            const orderA = orderMap.get(a.name);
            const orderB = orderMap.get(b.name);
            if (typeof orderA === 'undefined') return 1;
            if (typeof orderB === 'undefined') return -1;
            return orderA - orderB;
        }

        return (
            <ul className="rounded-theme w-[90vw] mx-auto my-gap grid gap-gap grid-cols-3 p-gap glass list-none">
                {game.achievements.sort(sort).map(item => ({...item, ...addEarnedInfo(item)})).map(renderItem)}
            </ul>
        )

    }

    return (
        <div className="relative z-[2]">
            {renderStats()}
            {renderAchievementItems()}
            {activeScreenshot ? <Modal onClose={() => setActiveScreenshot(null)}>
                <div className="bg-theme h-full overflow-auto p-[1vh_10vw] w-full">
                    <h2 className="border-b-2 border-b-text-secondary pb-gap-half text-center">{activeScreenshot.displayName}</h2>
                    <img src={activeScreenshot.path} alt={activeScreenshot.displayName} className="border border-text-secondary rounded-theme max-w-full"/>
                </div>
            </Modal> : null}
        </div>
    )
}

export default Achievements;