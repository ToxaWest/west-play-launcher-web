import Input from "../../Input";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from '../settings.module.scss';
import {useState} from "react";
import useNotification from "../../../hooks/useNotification";
import electronConnector from "../../../helpers/electronConnector";
import {locales} from "../../../helpers/locales";

const SettingsConfig = () => {
    const [settings, setSettings] = useState(getFromStorage('config').settings);
    const notifications = useNotification();

    const onChange = ({name, value}) => {
        setSettings(g => ({...g, [name]: value}))
    }

    const getExePath = (name) => {
        electronConnector.getFile().then(value => {
            onChange({name, value});
        })
    }

    return (
        <>
            <div className={styles.block}>
                <h1>Config</h1>
                <Input
                    label={'Steam Language'}
                    name="currentLang"
                    type="select"
                    value={settings.currentLang}
                    options={locales}
                    onChange={onChange}
                />
                <Input label={'Steam Web API Key (needed for achievements)'}
                       name="steam_api_key"
                       value={settings.steam_api_key}
                       onChange={({value, name}) => setSettings((s) => ({...s, [name]: value}))}
                />
                <Input label={'EGS profile id (needed for achievements)'}
                       name="egs_profile"
                       value={settings.egs_profile}
                       onChange={({value, name}) => setSettings((s) => ({...s, [name]: value}))}
                />
                <Input label={'Library games in row'}
                       name="gamesInRow"
                       type="number"
                       value={settings.gamesInRow}
                       onChange={({value, name}) => setSettings((s) => ({...s, [name]: value}))}
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
                       type="number"
                       step="0.1"
                       min="0.1"
                       max="1"
                       value={settings.audioVolume || 0.3}
                       onChange={({value, name}) => setSettings((s) => ({...s, [name]: value}))}
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
                <Input label='RPCS3 exe path'
                       value={settings.rpcs3}
                       onChange={onChange}
                       name='rpcs3'>
                    <button onClick={() => getExePath('rpcs3')}>Get exe path</button>
                </Input>
                <Input label='Ryujinx exe path'
                       value={settings.ryujinx}
                       onChange={onChange}
                       name='ryujinx'>
                    <button onClick={() => getExePath('ryujinx')}>Get exe path</button>
                </Input>
                <button onClick={() => {
                    setToStorage('config', {settings})
                    notifications({
                        img: '/assets/controller/save.svg',
                        status: 'saving',
                        name: 'Saved successfully',
                        description: 'Configuration updated'
                    })
                }}>
                    Save
                </button>
            </div>
        </>
    )
}

export default SettingsConfig