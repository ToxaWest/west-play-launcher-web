import React from "react";
import type {EarnedAchievementsType, Game} from "@type/game.types";
import {useNavigate} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";
import RenderHLTB from "../Game/renderHLTB";

const PlayedWidget = () => {
    const navigate = useNavigate();
    const games = getFromStorage('games');
    const [gameIndex, setGameIndex] = React.useState<number>(0)
    const lastPlayed = getFromStorage('lastPlayed');
    const configuredArray = React.useMemo(() => {
        const res = Object.entries(lastPlayed)
            .sort(([, ap], [, bp]) => ap < bp ? 1 : -1)
            .reduce((acc, [curr]) => {
                const game = games.find(({id}) => id == curr);
                if (game && game.archive) return acc;
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
    }, [games, lastPlayed])

    const game: Game = configuredArray[gameIndex] || {}

    const renderGame = (game: Game, index: number) => {
        return (
            <li key={game.id}
                tabIndex={1}
                role="button"
                id={game.id.toString()}
                className={`whitespace-nowrap w-[6vw] min-w-0 aspect-square flex p-[5px] transition-all duration-200 ease-in-out items-center justify-center cursor-pointer glass focus:relative focus:z-[2] focus:glass-active active:relative active:z-[2] active:glass-active focus-bloom ${gameIndex === index ? 'relative z-[2] glass-active' : ''}`}
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
                    setGameIndex(index)
                }}>
                <img src={game.img_icon} alt={game.title} loading={"lazy"}
                     className={`w-full h-full object-cover rounded-theme transition-all duration-200 ease-in-out ${game.img_icon?.includes('library-icon') ? 'dark:invert' : ''}`}
                     onMouseEnter={(e) => {
                         (e.target as HTMLElement).parentElement.focus()
                     }}/>
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

        return <div className="p-theme bg-theme-transparent rounded-theme block ml-auto text-right">
            <span>{i18n.t('Achievements')}: </span>
            {achString}
        </div>
    }

    return (
        <>
            <ul className="inline-flex content-center gap-gap-half overflow-x-auto list-none max-w-full h-[8vw] relative m-0 p-gap">
                {configuredArray.map(renderGame)}
            </ul>
            <div className="m-0 indent-0 p-theme flex items-start gap-gap">
                <img src={game.img_grid} alt={game.title} loading={"lazy"}
                     className={`rounded-theme overflow-hidden w-[17vw] ${game.img_grid?.includes('library-icon') ? 'dark:invert' : ''}`}/>
                <div className="p-theme max-w-[33vw] w-full glass [&_li]:mb-gap-half [&_li]:gap-gap-half [&_li]:flex [&_li]:items-center [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none">
                    <h1 className="text-[1.5vw] my-gap-half mx-0">{game.name}</h1>
                    <p>{game.short_description}</p>
                    <RenderHLTB game={game}/>
                    {renderAchievements()}
                </div>
            </div>
        </>

    )

}

export default PlayedWidget;