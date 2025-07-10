import React from "react";

import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import {Game} from "../../../types/game.types";

import AddGame from "./addGame";

import styles from "../settings.module.scss";

const SettingsGames = () => {
    const initialGames = getFromStorage('games');
    const [games, setGames] = React.useState(initialGames)
    const [activeIndex, setActiveIndex] = React.useState<number>(null);

    const renderForm = () => {
        if (typeof activeIndex !== 'number') return null

        return (
            <AddGame
                data={games[activeIndex]}
                remove={() => {
                    setGames(g => {
                        g.splice(activeIndex, 1)
                        return [...g];
                    })
                    setActiveIndex(null)
                    setToStorage('games', games)
                    window.location.reload()
                }}
                submit={(d: Game) => {
                    setGames(g => {
                        g[activeIndex] = d
                        return [...g]
                    })
                    setActiveIndex(null)
                    setToStorage('games', games)
                    window.location.reload()
                }}
            />

        )
    }

    return (
        <div className={styles.block} id="settings-games">
            <h1>Games</h1>
            <ul className={styles.iconsWrapper}>
                {games.map((game, index) => (
                    <li key={game.id} role="button" onClick={() => {
                        setActiveIndex((i) => {
                            if(i === index) return null
                            return index
                        })
                    }} className={activeIndex === index ? styles.active : ''} tabIndex={1}>
                        {game.img_icon && <img src={game.img_icon} alt={game.name}/>}
                        <span>{game.name}</span>
                    </li>
                ))}
            </ul>
            <button tabIndex={1} type="button" onClick={() => {
                setGames((d) => {
                    return [{
                        dlc: [],
                        dlcList: [],
                        exeArgs: {},
                        exePath: '',
                        id: 'tempGameId',
                        img_grid:'',
                        img_hero: '',
                        img_icon: '',
                        img_logo: '',
                        movies: [],
                        name: '',
                        path: '',
                        screenshots: [],
                        source: null,
                        title: '',
                        unofficial: null
                    }, ...d]
                })
                setActiveIndex(0)
            }}>Add Game
            </button>
            {renderForm()}
        </div>

    )

}

export default SettingsGames;