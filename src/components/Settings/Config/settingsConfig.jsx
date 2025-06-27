import Input from "../../Input";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from '../settings.module.scss';
import {startTransition, useActionState, useEffect, useState} from "react";
import useNotification from "../../../hooks/useNotification";
import electronConnector from "../../../helpers/electronConnector";
import Loader from "../../Loader";

const SettingsConfig = () => {
    const [settings, setSettings] = useState(getFromStorage('config').settings);
    const [profiles, action, loading] = useActionState(electronConnector.getSteamUserId, [])
    const notifications = useNotification();

    useEffect(() => {
        startTransition(action)
    }, [])

    const onChange = ({name, value}) => {
        setSettings(g => ({...g, [name]: value}))
    }

    const renderSteamProfiles = () => {
        return (
            <div className={styles.profileWrapper}>
                <Loader loading={loading}/>
                <h3>Steam profiles</h3>
                <ul>
                    {profiles.map((profile) => (
                        <li key={profile.id} tabIndex={1}
                            onClick={() => {
                                onChange({name: 'steamProfile', value: profile})
                            }}
                        >
                            <img src={profile.avatarImage} alt={profile.PersonaName}/>
                            <div>
                                <span>{profile.PersonaName}</span>
                                <i>{profile.AccountName} ({profile.id})</i>
                            </div>
                            {settings.steamProfile?.id === profile.id ? <span className={styles.selected}/> : null}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <>
            <div className={styles.block} id="settings-config">
                <h1>Config</h1>
                {renderSteamProfiles()}
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