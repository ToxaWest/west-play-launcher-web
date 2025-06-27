import styles from '../settings.module.scss';
import {startTransition, useActionState, useEffect} from "react";
import electronConnector from "../../../helpers/electronConnector";
import Loader from "../../Loader";

const SettingsSteamProfile = ({onChange, steamProfile}) => {
    const [profiles, action, loading] = useActionState(electronConnector.getSteamUserId, [])

    useEffect(() => {
        startTransition(action)
    }, [])

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