import React from "react";
import type {getSteamUserId} from "@type/electron.types";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";
import Loader from "../../Loader";

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
            <div className="bg-theme-transparent p-theme relative">
                <Loader loading={loading}/>
                <h3>{i18n.t('Steam profiles')}</h3>
                <ul className="grid grid-cols-2 gap-gap-half list-none p-0">
                    {profiles.map((profile) => (
                        <li key={profile.id} role="button" tabIndex={1}
                            className="bg-theme gap-gap-half rounded-theme flex border-2 border-theme-transparent transition-all duration-300 ease-in-out cursor-pointer relative hover:bg-theme-transparent hover:border-theme focus:bg-theme-transparent focus:border-theme active:bg-theme-transparent active:border-theme"
                            onClick={() => {
                                onChange({name: 'steamProfile', value: profile})
                            }}
                        >
                            <img src={profile.avatarImage} alt={profile.PersonaName} className="max-h-[100px]"/>
                            <div className="p-theme flex flex-col gap-gap justify-center">
                                <span>{profile.PersonaName}</span>
                                <i className="text-text-secondary">{profile.AccountName} ({profile.id})</i>
                            </div>
                            {steamProfile?.id === profile.id ? <span className="inline-block rotate-45 h-[25px] w-3 border-b-[7px] border-b-[#78b13f] border-r-[7px] border-r-[#78b13f] ml-auto mt-gap mr-gap"/> : null}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return renderSteamProfiles()
}

export default SettingsSteamProfile