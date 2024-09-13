import styles from "../settings.module.scss";
import electronConnector from "../../../helpers/electronConnector";
import {useState} from "react";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import Input from "../../Input";
import {locales} from "../../../helpers/locales";
import useNotification from "../../../hooks/useNotification";

const SettingsHome = () => {
    const notifications = useNotification();
    const [settings, setSettings] = useState(getFromStorage('config').settings);

    const onChange = ({name, value}) => {
        setSettings(g => ({...g, [name]: value}))
    }

    return (
        <div className={styles.block} id="settingsHome">
            <h1>Settings</h1>
            <Input label={'Monitor'}
                   type="select"
                   name="changeDisplayMode"
                   options={[{
                       label: 'PC Screen',
                       value: 1
                   }, {
                       label: 'Duplicate',
                       value: 2
                   }, {
                       label: 'Extend',
                       value: 3
                   }, {
                       label: 'Second Screen',
                       value: 4
                   }]}
                   onChange={({value}) => {
                       if (value) {
                           electronConnector.systemAction(`DisplaySwitch ${value}`)
                       }
                   }}
            />
            <Input label={'Theme'}
                   type="select"
                   name="theme"
                   options={[{
                       label: 'System',
                       value: 'system'
                   },{
                       label: 'Light',
                       value: 'light'
                   }, {
                       label: 'Dark',
                       value: 'dark'
                   }]}
                   value={settings.theme || 'system'}
                   onChange={onChange}
            />
            <Input
                label={'Language'}
                name="currentLang"
                type="select"
                value={settings.currentLang}
                options={locales}
                onChange={onChange}
            />
            <Input label={'Library games in row'}
                   type="select"
                   name="gamesInRow"
                   options={Array.from({length: 6}).map((_, index) => (index + 4))}
                   value={settings.gamesInRow}
                   onChange={onChange}
            />
            <Input
                label={'Use audio background (game view)'}
                type="select"
                name="gameAudio"
                options={[{
                    label: 'Yes',
                    value: 1
                }, {
                    label: 'No',
                    value: 0
                }]}
                value={settings.gameAudio}
                onChange={onChange}
            />
            <Input label={'Game Audio volume'}
                   name="audioVolume"
                   type="select"
                   value={settings.audioVolume || 0.3}
                   options={Array.from({length: 10}).map((_, index) => ({
                       label: ((index + 1) * 10) + '%',
                       value: (index + 1) / 10
                   }))}
                   onChange={onChange}
            />
            <Input
                label={'Use colored background (game view)'}
                type="select"
                name="coloredGames"
                options={[{
                    label: 'Yes',
                    value: 1
                }, {
                    label: 'No',
                    value: 0
                }]}
                value={settings.coloredGames}
                onChange={onChange}
            />
            <button tabIndex={1} onClick={() => {
                electronConnector.clearUnusedCache(getFromStorage('games').map(({id}) => id.toString()))
            }}>
                Remove unused cache
            </button>
            <button tabIndex={1} onClick={() => {
                setToStorage('config', {settings})
                notifications({
                    img: '/assets/controller/save.svg',
                    status: 'saving',
                    name: 'Saved successfully',
                    description: 'Configuration updated'
                })
                setTimeout(() => {
                    window.location.reload();
                },3000)
            }}>
                Save
            </button>
        </div>
    )
}

export default SettingsHome;