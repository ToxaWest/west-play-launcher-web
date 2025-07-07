import styles from "../settings.module.scss";
import AddGame from "./addGame";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import {useState} from "react";

const SettingsGames = () => {
    const [games, setGames] = useState(getFromStorage('games'))
    const [activeIndex, setActiveIndex] = useState(null);

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
                submit={(d) => {
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
                    <li key={game.id} onClick={() => {
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
            <button tabIndex={1} onClick={() => {
                setGames((d) => {
                    return [{}, ...d]
                })
                setActiveIndex(0)
            }}>Add Game
            </button>
            {renderForm()}
        </div>

    )

}

export default SettingsGames;