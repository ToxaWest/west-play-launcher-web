import Input from "../../Input";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from '../settings.module.scss';
import {useState} from "react";
import useNotification from "../../../hooks/useNotification";

const SettingsConfig = () => {
    const [settings, setSettings] = useState(getFromStorage('config').settings);
    const notifications = useNotification();

    const onChange = ({name, value}) => {
        setSettings(g => ({...g, [name]: value}))
    }

    return (
        <>
            <div className={styles.block} id="settings-config">
                <h1>Config</h1>
                <Input label={'Steam profile id (needed for achievements)'}
                       name="steamid"
                       value={settings.steamid}
                       onChange={onChange}
                />
                <Input label='Ryujinx exe path'
                       value={settings.ryujinx}
                       onChange={onChange}
                       type="path"
                       onlyFile={true}
                       name='ryujinx'>
                </Input>
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
                    }, 3000)
                }}>
                    Save
                </button>
            </div>
        </>
    )
}

export default SettingsConfig