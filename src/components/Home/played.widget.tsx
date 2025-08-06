import React from "react";
import type {EarnedAchievementsType, Game} from "@type/game.types";
import {useNavigate} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";
import RenderHLTB from "../Game/renderHLTB";

import styles from "./widgets.module.scss"

const PlayedWidget = () => {
    const navigate = useNavigate();
    const games = getFromStorage('games');
    const [gameIndex, setGame] = React.useState<number>(0)
    const lastPlayed = getFromStorage('lastPlayed');
    const configuredArray = React.useMemo(() => {
        const res = Object.entries(lastPlayed)
            .sort(([, ap], [, bp]) => ap < bp ? 1 : -1)
            .reduce((acc, [curr]) => {
                const game = games.find(({id}) => id == curr);
                return game ? [...acc, game] : acc
            }, [])
        if (res.length > 8) res.length = 8;

        return [...res, {
            id: 'library',
            img_grid: '/assets/library-icon-1181955-512.png',
            img_icon: '/assets/library-icon-1181955-512.png',
            name: 'Library',
            short_description: 'Installed games library',
            title: 'Library'
        }];
    }, [])

    const game: Game = configuredArray[gameIndex] || {}

    const renderGame = (game: Game, index: number) => {
        return (
            <li key={game.id}
                tabIndex={1}
                role="button"
                id={game.id.toString()}
                onClick={() => {
                    if (game.id === 'library') {
                        navigate('/' + game.id)
                        return;
                    }
                    window.__back = {id: game.id, url: '/'}
                    navigate('/game/' + game.id)
                }}
                onMouseEnter={(e) => {
                    (e.target as HTMLElement).focus()
                }}
                onFocus={() => {
                    setGame(index)
                }}>
                <img src={game.img_icon} alt={game.title} loading={"lazy"}/>
            </li>
        )
    }

    const getAchCount = (a: EarnedAchievementsType) => Object.values(a)
        .filter(({earned}) => earned).length

    const renderAchievements = () => {
        const getAchievementsString = () => {
            if (game.id === 'library') return Object.values(getFromStorage('achievements') || {}).reduce((acc, a) => acc + getAchCount(a), 0)
            if (game.achievements) {
                const ach = getFromStorage('achievements')[game.id] || {}
                return `${getAchCount(ach)} of ${Object.keys(game.achievements).length}`
            }
            return null;
        }

        const achString = getAchievementsString();
        if (!achString) return null;

        return <div className={styles.achievements}>
            <span>{i18n.t('Achievements')}: </span>
            {achString}
        </div>
    }

    return (
        <>
            <ul className={styles.lastPlayed}>
                {configuredArray.map(renderGame)}
            </ul>
            <div className={styles.game}>
                <img src={game.img_grid} alt={game.title} loading={"lazy"}/>
                <div className={styles.info}>
                    <h1>{game.name}</h1>
                    <p>{game.short_description}</p>
                    <RenderHLTB game={game}/>
                    {renderAchievements()}
                </div>
            </div>
        </>

    )

}

export default PlayedWidget;