import React from "react";
import useNotification from "@hook/useNotification";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import {locales} from "../../../helpers/locales";
import i18n from "../../../helpers/translate";
import Input from "../../Input";

import SettingsAlarm from "./settingsAlarm";
import SettingsSteamProfile from "./settingsSteamProfile";
import SettingsWeather from "./settingsWeather";

import styles from "../settings.module.scss";

const SettingsHome = () => {
    const notifications = useNotification();
    const initialSettings = getFromStorage('config').settings;
    const [settings, setSettings] = React.useState(initialSettings);

    const onChange = ({name, value}) => {
        setSettings(g => ({...g, [name]: value}))
    }

    return (
        <div className={styles.block} id="settingsHome">
            <h1>{i18n.t('Settings')}</h1>
            <Input label={i18n.t('Monitor')}
                   type="select"
                   name="changeDisplayMode"
                   options={[{
                       label: i18n.t('PC Screen'),
                       value: 1
                   }, {
                       label: i18n.t('Duplicate'),
                       value: 2
                   }, {
                       label: i18n.t('Extend'),
                       value: 3
                   }, {
                       label: i18n.t('Second Screen'),
                       value: 4
                   }]}
                   onChange={({value}) => {
                       if (value) electronConnector.systemAction(`DisplaySwitch ${value}`)
                   }}
            />
            <Input label={i18n.t('Theme')}
                   type="select"
                   name="theme"
                   options={[{
                       label: i18n.t('System'),
                       value: 'system'
                   }, {
                       label: i18n.t('Light'),
                       value: 'light'
                   }, {
                       label: i18n.t('Dark'),
                       value: 'dark'
                   }]}
                   value={settings.theme || 'system'}
                   onChange={onChange}
            />
            <Input
                label={i18n.t('Language')}
                name="currentLang"
                type="select"
                value={settings.currentLang}
                options={locales.map(({label, value}) => ({label, value}))}
                onChange={onChange}
            />
            <Input label={i18n.t('Library games in row')}
                   type="select"
                   name="gamesInRow"
                   options={Array.from({length: 6}).map((_, index) => (index + 4))}
                   value={settings.gamesInRow}
                   onChange={onChange}
            />
            <div style={{display: 'flex', gap: 'var(--gap)'}}>
                <Input label={i18n.t('Live wallpaper')}
                       name="videoBg"
                       value={settings.videoBg}
                       type="path"
                       onlyFile={true}
                       onChange={onChange}
                />
                <button type="button" onClick={() => {
                    onChange({name: 'videoBg', value: ''})
                }}>
                    {i18n.t('Clear')}
                </button>
            </div>
            <Input
                label={i18n.t('Show cracked widget')}
                type="select"
                name="showCrackedWidget"
                options={[{
                    label: i18n.t('Yes'),
                    value: 1
                }, {
                    label: i18n.t('No'),
                    value: 0
                }]}
                value={settings.showCrackedWidget}
                onChange={onChange}
            />
            <Input
                label={i18n.t('Show free widget')}
                type="select"
                name="showFreeWidget"
                options={[{
                    label: i18n.t('Yes'),
                    value: 1
                }, {
                    label: i18n.t('No'),
                    value: 0
                }]}
                value={settings.showFreeWidget}
                onChange={onChange}
            />
            <Input
                label={i18n.t('Show Movies widget')}
                type="select"
                name="showMoviesWidget"
                options={[{
                    label: i18n.t('Yes'),
                    value: 1
                }, {
                    label: i18n.t('No'),
                    value: 0
                }]}
                value={settings.showMoviesWidget}
                onChange={onChange}
            />
            <Input
                label={i18n.t('Use system notification')}
                type="select"
                name="useSystemNotification"
                options={[{
                    label: i18n.t('Yes'),
                    value: 1
                }, {
                    label: i18n.t('No'),
                    value: 0
                }]}
                value={settings.useSystemNotification}
                onChange={onChange}
            />
            <button tabIndex={1} type="button" onClick={() => {
                setToStorage('hiddenFree', [])
                notifications({
                    description: i18n.t('Hidden free games updated'),
                    img: '/assets/controller/save.svg',
                    name: i18n.t('Reset successfully'),
                    status: 'saving'
                })
            }}>
                {i18n.t('Reset hidden free games')}
            </button>
            <button tabIndex={1} type="button" onClick={() => {
                const gamesInList = getFromStorage('games').map(({id}) => id.toString());
                const playTime = getFromStorage('playTime');
                Object.keys(playTime).forEach((key) => {
                    if (gamesInList.indexOf(key.toString()) === -1) delete playTime[key];
                })
                setToStorage('playTime', playTime)
                const lastPlayed = getFromStorage('lastPlayed');
                Object.keys(lastPlayed).forEach((key) => {
                    if (gamesInList.indexOf(key.toString()) === -1) delete lastPlayed[key];
                })
                setToStorage('lastPlayed', lastPlayed)
                const achievements = getFromStorage('achievements');
                Object.keys(achievements).forEach((key) => {
                    if (gamesInList.indexOf(key.toString()) === -1) delete achievements[key];
                })
                setToStorage('achievements', achievements)
                const stats = getFromStorage('stats');
                Object.keys(stats).forEach((key) => {
                    if (gamesInList.indexOf(key.toString()) === -1) delete stats[key];
                })
                setToStorage('stats', stats)
                const progress = getFromStorage('progress');
                Object.keys(progress).forEach((key) => {
                    if (gamesInList.indexOf(key.toString()) === -1) delete progress[key];
                })
                setToStorage('progress', progress)

                electronConnector.clearUnusedCache(gamesInList).then(({removed}) => {
                    notifications({
                        description: i18n.t('Removed {{removed}} assets', {removed}),
                        img: '/assets/controller/save.svg',
                        name: i18n.t('Assets removed'),
                        status: 'success'
                    })
                })
            }}>
                {i18n.t('Remove unused cache')}
            </button>
            <Input label={i18n.t('Ryujinx exe path')}
                   value={settings.ryujinx}
                   onChange={onChange}
                   type="path"
                   onlyFile={true}
                   name='ryujinx'>
            </Input>
            <SettingsSteamProfile onChange={onChange} steamProfile={settings.steamProfile}/>
            <SettingsWeather/>
            <SettingsAlarm value={settings.uaAlarmId} onChange={onChange}/>
            <button tabIndex={1} type="button" onClick={() => {
                setToStorage('config', {settings})
                notifications({
                    description: i18n.t('Configuration updated'),
                    img: '/assets/controller/save.svg',
                    name: i18n.t('Saved successfully'),
                    status: 'saving'
                })
                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            }}>
                {i18n.t('Save')}
            </button>
        </div>
    )
}

export default SettingsHome;