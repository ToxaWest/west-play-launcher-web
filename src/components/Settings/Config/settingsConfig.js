import Input from "../../Input";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from '../settings.module.scss';
import {useState} from "react";
import useNotification from "../../../hooks/useNotification";
import Modal from "../../Modal";
import FileManager from "../../FileManager";

const SettingsConfig = () => {
    const [settings, setSettings] = useState(getFromStorage('config').settings);
    const notifications = useNotification();
    const [openFileManager, setOpenFileManager] = useState(false);

    const onChange = ({name, value}) => {
        setSettings(g => ({...g, [name]: value}))
    }

    return (
        <>
            {Boolean(openFileManager) && <Modal onClose={() => setOpenFileManager(false)}>
                <FileManager submit={(value) => {
                    onChange({value, name: openFileManager})
                    setOpenFileManager(false)
                }} file={true} initial={settings[openFileManager] || ''}/>
            </Modal>}
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
                    <button onClick={() => setOpenFileManager('rpcs3')} tabIndex={1}>Get exe path</button>
                </Input>
                <Input label='Ryujinx exe path'
                       value={settings.ryujinx}
                       disabled={true}
                       onChange={onChange}
                       name='ryujinx'>
                    <button onClick={() => setOpenFileManager('ryujinx')} tabIndex={1}>Get exe path</button>
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