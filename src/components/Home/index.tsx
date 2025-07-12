import React from "react";
import useFooterActions from "@hook/useFooterActions";
import type {EarnedAchievementsType, Game} from "@type/game.types";
import type {ReactElement} from "react";

import {getFromStorage} from "../../helpers/getFromStorage";
import RenderHLTB from "../Game/renderHLTB";
import MoviesWidget from "../Media/movies.widget";

import CrackedWidget from "./cracked.widget";
import FreeWidget from "./free.widget";
import PlayedWidget from "./played.widget";

import styles from "./home.module.scss";

const Home = () => {
    const [game, setGame] = React.useState<Game | {
        short_description: string | null
        id: string | number | null
        achievements: null | EarnedAchievementsType
        name: string,
        title: string | null,
        img_grid: string | null,
        img_hero: string | null,
    }>({
        achievements: null,
        id: null,
        img_grid: null,
        img_hero: null,
        name: null,
        short_description: null,
        title: null
    });
    const {setFooterActions} = useFooterActions()
    const {
        videoBg,
        showFreeWidget,
        showCrackedWidget,
        showMoviesWidget
    } = getFromStorage('config').settings;
    const getUrl = (url?: string) => {
        if (!url) return ''

        return new URL(url).toString()
    }

    React.useEffect(() => {
        setFooterActions({})
    }, [])

    const renderDescription = () => {
        if (game.short_description) return (<p>{game.short_description}</p>)
        return null
    }

    const getAchCount = (a: EarnedAchievementsType) => Object.values(a)
        .filter(({earned, progress}) => {
            if (!earned) return false
            if (progress) return progress === 1
            return true
        }).length

    const renderAchievements = () => {
        if (game.achievements) {
            const ach = getFromStorage('achievements')[game.id] || {}

            return <div className={styles.achievements}>
                <span>Achievements: </span>
                {getAchCount(ach)} of {Object.keys(game.achievements).length}
            </div>
        }
        if (game.id === 'library') {
            return <div className={styles.achievements}>
                <span>Achievements: </span>
                {Object.values(getFromStorage('achievements') || {}).reduce((acc, a) => acc + getAchCount(a), 0)}
            </div>
        }
        return null
    }

    const renderWrapper = (children: ReactElement) => {
        const props = {
            className: videoBg ? styles.videoBg : styles.wrapper,
            style: videoBg ? {} : {backgroundImage: `url('${getUrl(game.img_hero)}')`},
        }

        return (
            <div {...props}>
                {children}
            </div>
        )
    }

    return renderWrapper(
        <div className={styles.innerWrapper}>
            <PlayedWidget setGame={setGame}/>
            <div className={styles.game}>
                <img src={game.img_grid} alt={game.title} loading={"lazy"}/>
                <div className={styles.info}>
                    <h1>{game.name}</h1>
                    {renderDescription()}
                    <RenderHLTB game={game as Game}/>
                    {renderAchievements()}
                </div>
            </div>
            {showFreeWidget === 1 && <FreeWidget/>}
            {showCrackedWidget === 1 && <CrackedWidget/>}
            {showMoviesWidget === 1 && <MoviesWidget/>}
        </div>
    )
}

export default Home;