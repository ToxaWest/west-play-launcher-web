import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Input from "../../Input";
import Loader from "../../Loader";
import KinozalSettings from "../Games/kinozal";

const Section = ({title, children}: {title: string, children: React.ReactNode}) => (
    <div className="flex flex-col gap-2 mb-gap">
        <h2 className="text-lg font-bold px-2 opacity-70">{title}</h2>
        <div className="glass p-theme rounded-theme flex flex-col gap-2">
            {children}
        </div>
    </div>
)

const SettingMedia = () => {
    const initialSettings = getFromStorage('movies');
    const [settings, setSettings] = React.useState(initialSettings)
    const [loading, setLoading] = React.useState(false)
    const [login, setLogin] = React.useState({
        login_name: '',
        login_not_save: 0,
        login_password: ''
    })

    return (
        <div className="pb-10">
            <h1 className="text-2xl font-bold mb-gap px-2">{i18n.t('Media')}</h1>
            
            <Section title={i18n.t('Kinozal')}>
                <KinozalSettings />
            </Section>

            <Section title={i18n.t('Proxy & Content')}>
                <Input label={i18n.t('Proxy URL')}
                    type="select"
                    options={[
                        { label: 'standby-rezka.tv', value: 'https://standby-rezka.tv/' },
                        { label: 'rezka-ua.org', value: 'https://rezka-ua.org/' },
                        { label: 'hdrezka.sh', value: 'https://hdrezka.sh/' },
                        { label: 'rezka-ua.in', value: 'https://rezka-ua.in/' }
                    ]}
                    value={settings.proxy}
                    onChange={({value}) => {
                        setSettings({...settings, proxy: value as string})
                    }}
                    name="proxy"
                />
            </Section>

            <Section title={i18n.t('HDRezka Account')}>
                {!settings.authorized ? (
                    <div className="flex flex-col gap-2">
                        <Input label={i18n.t('Username')}
                            onChange={({value}) => {
                                setLogin({...login, login_name: value as string})
                            }}
                        />
                        <Input label={i18n.t('Password')}
                            onChange={({value}) => {
                                setLogin({...login, login_password: value as string})
                            }}
                        />
                        <button type="button" tabIndex={1} className="mt-2" onClick={() => {
                            setLoading(true)
                            electronConnector.movieLogin(login).then(cookieString => {
                                setLoading(false)
                                if (cookieString) {
                                    setSettings({ ...settings, authorized: true, cookieString })
                                }
                            })
                        }}>{i18n.t('Login')}</button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <span className="text-earned font-medium">{i18n.t('Authorized')}</span>
                        <button type="button" tabIndex={1} className="m-0 py-1" onClick={() => {
                            setSettings({...settings, authorized: false, cookieString: ''})
                        }}>{i18n.t('Reset Login')}</button>
                    </div>
                )}
            </Section>

            <button type="button" tabIndex={1} className="w-full py-3 text-lg font-bold mt-6" onClick={() => {
                setToStorage('movies', settings)
                window.location.reload()
            }}>
                {i18n.t('Save')}
            </button>
            <Loader loading={loading}/>
        </div>
    )
}

export default SettingMedia