import {useState} from "react";
import styles from "./settings.module.scss";
import AddGame from "./addGame";
import Input from "../Input";
import useNotification from "../../hooks/useNotification";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";

const Settings = () => {
    const [settings, setSettings] = useState(getFromStorage('config').settings);
    const [games, setGames] = useState(getFromStorage('games'))
    const notifications = useNotification();
    return (
        <div className={styles.wrapper}>
            <details className={styles.block}>
                <summary>Steam</summary>
                <Input label={'Steam Web API Key (needed for achievements)'}
                       name="steam_api_key"
                       value={settings.steam_api_key}
                       onChange={({value, name}) => setSettings((s) => ({...s, [name]: value}))}
                />
                <Input label={'Library games in row'}
                       name="gamesInRow"
                       type="number"
                       value={settings.gamesInRow}
                       onChange={({value, name}) => setSettings((s) => ({...s, [name]: value}))}
                />
                <button onClick={() => {
                    setToStorage('config', {settings})
                    notifications({
                        img: '/assets/controller/save.svg',
                        status: 'saving',
                        name: 'Saved successfully',
                        description: 'Steam configuration updated'
                    })
                }}>
                    Save
                </button>
            </details>
            <details className={styles.block}>
                <summary>Games</summary>
                <button onClick={() => {
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
                <button onClick={() => {
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
            </details>
        </div>
    )
}
export default Settings;