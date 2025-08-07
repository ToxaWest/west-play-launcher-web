import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Input from "../../Input";
import Loader from "../../Loader";

import styles from "../settings.module.scss";

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
        <div className={styles.block}>
            <h1>{i18n.t('Media')}</h1>
            <Input label={i18n.t('Proxy URL')}
                   type="select"
                   options={[{
                       label: 'standby-rezka.tv',
                       value: 'https://standby-rezka.tv/'
                   }, {
                       label: 'rezka-ua.org',
                       value: 'https://rezka-ua.org/'
                   }, {
                       label: 'hdrezka.sh',
                       value: 'https://hdrezka.sh/'
                   }, {
                       label: 'rezka-ua.in',
                       value: 'https://rezka-ua.in/'
                   }]}
                   value={settings.proxy}
                   onChange={({value}) => {
                       setSettings({...settings, proxy: value as string})
                   }}
                   name="proxy"
            />
            {!settings.authorized ? <div>
                <h2>{i18n.t('Login')}</h2>
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
                <button type="button" tabIndex={1} onClick={() => {
                    setLoading(true)
                    electronConnector.movieLogin(login).then(cookieString => {
                        setLoading(false)
                        if (cookieString) {
                            setSettings({
                                ...settings,
                                authorized: true,
                                cookieString
                            })
                        }
                    })
                }}>{i18n.t('Login')}</button>
            </div> : <button type="button" tabIndex={1} onClick={() => {
                setSettings({...settings, authorized: false, cookieString: ''})
            }}>{i18n.t('Reset Login')}</button>}

            <button type="button" tabIndex={1} onClick={() => {
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