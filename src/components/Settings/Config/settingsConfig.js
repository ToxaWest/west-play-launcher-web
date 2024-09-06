import Input from "../../Input";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from '../settings.module.scss';
import {useEffect, useState} from "react";
import useNotification from "../../../hooks/useNotification";
import electronConnector from "../../../helpers/electronConnector";
import useAppControls from "../../../hooks/useAppControls";

const SettingsConfig = () => {
    const [settings, setSettings] = useState(getFromStorage('config').settings);
    const notifications = useNotification();

    const {init} = useAppControls()

    useEffect(() => {
        init('#settings-config [tabindex="1"], #settings-config button:not(:disabled)')
    }, [])

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
            <div className={styles.block} id="settings-config">
                <h1>Config</h1>

                <Input label={'Steam Web API Key (needed for achievements)'}
                       name="steam_api_key"
                       value={settings.steam_api_key}
                       onChange={onChange}
                />
                <Input label={'EGS profile id (needed for achievements)'}
                       name="egs_profile"
                       value={settings.egs_profile}
                       onChange={onChange}
                />

                <Input label='RPCS3 exe path'
                       value={settings.rpcs3}
                       onChange={onChange}
                       disabled={true}
                       name='rpcs3'>
                    <button onClick={() => getExePath('rpcs3')}>Get exe path</button>
                </Input>
                <Input label='Ryujinx exe path'
                       value={settings.ryujinx}
                       disabled={true}
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