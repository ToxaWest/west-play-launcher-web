import {useState} from "react";
import styles from "./settings.module.scss";
import AddGame from "./addGame";
import Input from "../Input";

const Settings = () => {
    const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('config')).settings);
    const [games, setGames] = useState(JSON.parse(localStorage.getItem('games')))

    return (
        <div className={styles.wrapper}>
            <details className={styles.block}>
                <summary>Steam</summary>
                <Input label={'Steam Web API Key (needed for achievements)'}
                       name="steam_api_key"
                       value={settings.steam_api_key}
                       onChange={({value, name}) => setSettings((s) => ({...s, [name]: value}))}
                />
                <button onClick={() => {
                    localStorage.setItem('config', JSON.stringify({settings}));
                }}>
                    Save
                </button>
            </details>
            <details className={styles.block}>
                <summary>Games</summary>
                <button onClick={() => {
                    setGames((d) => {
                        return [{id: new Date().getMilliseconds()}, ...d]
                    })
                }}>Add Game
                </button>
                <ul>
                    {games.map((game, index) => (
                        <li key={game.id}>
                            <AddGame data={game} submit={(d) => {
                                setGames(g => {
                                    g[index] = {
                                        id: game.id,
                                        ...d
                                    }
                                    return [
                                        ...g
                                    ]
                                })
                            }}
                            />
                        </li>
                    ))}
                </ul>
                <button onClick={() => {
                    localStorage.setItem('games', JSON.stringify(games));
                }}>
                    Save
                </button>
            </details>
        </div>
    )
}
export default Settings;