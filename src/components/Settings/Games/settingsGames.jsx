import styles from "../settings.module.scss";
import AddGame from "./addGame";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import {useState} from "react";
import useNotification from "../../../hooks/useNotification";

const SettingsGames = () => {
    const [games, setGames] = useState(getFromStorage('games'))
    const notifications = useNotification();

    return (
        <div className={styles.block} id="settings-games">
            <h1>Games</h1>
            <button tabIndex={1} onClick={() => {
                setGames((d) => {
                    return [{id: new Date().getTime()}, ...d]
                })
            }}>Add Game
            </button>
            <ul>
                {games.map((game, index) => (
                    <li key={game.id}>
                        <AddGame data={game}
                             remove={() => {
                                 setGames(g => {
                                     g.splice(index, 1)
                                     return [...g];
                                 })
                             }}
                             submit={(d) => {
                                 setGames(g => {
                                     g[index] = {id: game.id, ...d}
                                     return [...g]
                                 })
                             }}
                        />
                    </li>
                ))}
            </ul>
            <button tabIndex={1} onClick={() => {
                setToStorage('games', games)
                notifications({
                    img: '/assets/controller/save.svg',
                    status: 'saving',
                    name: 'Saved successfully',
                    description: 'Games configuration updated'
                })
            }}>
                Save
            </button>
        </div>

    )

}

export default SettingsGames;