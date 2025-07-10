import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import type {getSteamUserId} from "../../../types/electron.types";
import Loader from "../../Loader";

import styles from '../settings.module.scss';

const SettingsSteamProfile = ({onChange, steamProfile} : {
    onChange: (value: {name: string, value: any}) => void,
    steamProfile: getSteamUserId
}) => {
    const [profiles, action, loading] = React.useActionState(electronConnector.getSteamUserId, [])

    React.useEffect(() => {
        React.startTransition(action)
    }, [])

    const renderSteamProfiles = () => {
        return (
            <div className={styles.profileWrapper}>
                <Loader loading={loading}/>
                <h3>Steam profiles</h3>
                <ul>
                    {profiles.map((profile) => (
                        <li key={profile.id} role="button" tabIndex={1}
                            onClick={() => {
                                onChange({name: 'steamProfile', value: profile})
                            }}
                        >
                            <img src={profile.avatarImage} alt={profile.PersonaName}/>
                            <div>
                                <span>{profile.PersonaName}</span>
                                <i>{profile.AccountName} ({profile.id})</i>
                            </div>
                            {steamProfile?.id === profile.id ? <span className={styles.selected}/> : null}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return renderSteamProfiles()
}

export default SettingsSteamProfile