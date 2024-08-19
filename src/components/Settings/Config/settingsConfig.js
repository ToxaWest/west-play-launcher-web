import Input from "../../Input";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from '../settings.module.scss';
import {useState} from "react";
import useNotification from "../../../hooks/useNotification";

const SettingsConfig = () => {
    const [settings, setSettings] = useState(getFromStorage('config').settings);
    const notifications = useNotification();
    return (
        <div className={styles.block}>
            <h1>Steam</h1>
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
        </div>
    )
}

export default SettingsConfig