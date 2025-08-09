import React, {SyntheticEvent} from "react";
import useAppControls from "@hook/useAppControls";
import type {
    achievementInterfaceType,
    EarnedAchievementsType,
    Game,
    ProgressType,
    StatsType
} from "@type/game.types";

import achStyles from '../Game/game.module.scss';
import styles from './externalGameData.module.scss';

type ExtendedAchievementType = EarnedAchievementsType[0] & {
    externalProgressValue: number,
    progress: number
    className: string
    image: string
}

const ExternalGameData = () => {
    const {init} = useAppControls()
    const [{game, achievements, stats, progress}, setState] = React.useState<{
        game: Game,
        stats: StatsType,
        progress: ProgressType,
        achievements: EarnedAchievementsType
    }>({
        achievements: null,
        game: null,
        progress: null,
        stats: null,
    })

    const externalProgress = progress || {}

    const websoketInit = () => {
        const webSocket = new WebSocket('ws://127.0.0.1:1488');
        webSocket.onerror = () => {
            setTimeout(() => {
                webSocket.close()
            }, 5000)
        }
        webSocket.onclose = () => {
            setState({
                achievements: null,
                game: null,
                progress: null,
                stats: null,
            })
            websoketInit()
        }
        webSocket.onmessage = (event) => {
            const data: {
                game: Game,
                stats: StatsType,
                progress: ProgressType,
                achievements: EarnedAchievementsType
            } = JSON.parse(event.data)
            setState(data)
        }
    }


    React.useEffect(() => {
        init('#root')
        websoketInit()
    }, [])

    const getImage = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        const src = (e.target as HTMLImageElement).src;
        if (!src) return;
        if (src.includes('http')) return;
        if (src.includes('https')) return;
        fetch(`http://127.0.0.1:1488/image?url=${src}`).then(res => res.text()).then(blob => {
            (e.target as HTMLImageElement).src = blob
        })
    }

    const getItemClassName = (name: string, type: string) => {
        const stylesArray = [];
        if (Object.hasOwn(achievements, name) && achievements[name].earned) stylesArray.push(achStyles.earned);
        if (type) stylesArray.push(achStyles['ach_' + type]);
        return stylesArray.join(' ')
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
            externalProgressValue,
            rarity,
        }: ExtendedAchievementType & achievementInterfaceType,
    ) => (
        <li key={name}
            className={className}
            style={getStyle(progress, rarity)}
            role="button"
            tabIndex={1}
        >
            <img src={image} alt={name} onError={getImage}/>
            <div>
                <strong>{displayName}</strong>
                <span title={description}>{description}</span>
                <div className={achStyles.additional}>
                    {typeof xp === "number" && <small>{xp} XP</small>}
                    {externalProgressValue !== 0 && <small>Progress: {externalProgressValue}</small>}
                    {Boolean(earned_time) &&
                        <small>{new Date(earned_time * 1000).toLocaleDateString()} - {new Date(earned_time * 1000).toLocaleTimeString()}</small>}
                </div>
            </div>
        </li>)

    const addEarnedInfo = ({
                               name,
                               type,
                               icongray,
                               displayName,
                               icon,
                           }: achievementInterfaceType): ExtendedAchievementType => {
        const className = getItemClassName(name, type);
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
        if (!Object.hasOwn(achievements, name)) return {
            ...achievements[name],
            className,
            externalProgressValue,
            image: icongray,
            progress: 0
        }


        return {
            ...achievements[name],
            className,
            externalProgressValue,
            image: achievements[name].earned ? icon : icongray,
            progress: achievements[name].progress || 0,
        }
    }
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
            <ul className={achStyles.achList + ' ' + styles.achievements}>
                {game.achievements.sort(sort).map(item => ({...item, ...addEarnedInfo(item)})).map(renderItem)}
            </ul>
        )

    }

    if (!game) return <div className={styles.wrapper}>
        <div className={styles.header}>
            <img src={'https://west-play-launcher-web.vercel.app/192.png'} alt={'logo'}/>
            <div className={styles.content}>
                <h1>Game not detected</h1>
            </div>
        </div>
    </div>

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <img src={game.img_icon} alt={'logo'} onError={getImage}/>
                <div className={styles.content}>
                    <h1>{game.name}</h1>
                    {achievements ?
                        <i>Achievements: {Object.values(achievements).filter(a => a.earned).length} of {Object.keys(game.achievements).length}</i> : null}
                </div>
            </div>
            {achievements ? renderAchievementItems() : null}
        </div>
    );
}

export default ExternalGameData;