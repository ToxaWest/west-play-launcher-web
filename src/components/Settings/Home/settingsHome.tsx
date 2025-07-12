import React from "react";
import useNotification from "@hook/useNotification";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import {locales} from "../../../helpers/locales";
import Input from "../../Input";

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
            <h1>Settings</h1>
            <Input label={'Monitor'}
                   type="select"
                   name="changeDisplayMode"
                   options={[{
                       label: 'PC Screen',
                       value: 1
                   }, {
                       label: 'Duplicate',
                       value: 2
                   }, {
                       label: 'Extend',
                       value: 3
                   }, {
                       label: 'Second Screen',
                       value: 4
                   }]}
                   onChange={({value}) => {
                       if (value) {
                           electronConnector.systemAction(`DisplaySwitch ${value}`)
                       }
                   }}
            />
            <Input label={'Theme'}
                   type="select"
                   name="theme"
                   options={[{
                       label: 'System',
                       value: 'system'
                   }, {
                       label: 'Light',
                       value: 'light'
                   }, {
                       label: 'Dark',
                       value: 'dark'
                   }]}
                   value={settings.theme || 'system'}
                   onChange={onChange}
            />
            <Input
                label={'Language'}
                name="currentLang"
                type="select"
                value={settings.currentLang}
                options={locales.map(({label, value}) => ({label, value}))}
                onChange={onChange}
            />
            <Input label={'Library games in row'}
                   type="select"
                   name="gamesInRow"
                   options={Array.from({length: 6}).map((_, index) => (index + 4))}
                   value={settings.gamesInRow}
                   onChange={onChange}
            />
            <Input label={'Live wallpaper url'}
                   name="videoBg"
                   value={settings.videoBg}
                   type="path"
                   onlyFile={true}
                   onChange={onChange}
            />
            <Input
                label={'Show cracked widget'}
                type="select"
                name="showCrackedWidget"
                options={[{
                    label: 'Yes',
                    value: 1
                }, {
                    label: 'No',
                    value: 0
                }]}
                value={settings.showCrackedWidget}
                onChange={onChange}
            />
            <Input
                label={'Show free widget'}
                type="select"
                name="showFreeWidget"
                options={[{
                    label: 'Yes',
                    value: 1
                }, {
                    label: 'No',
                    value: 0
                }]}
                value={settings.showFreeWidget}
                onChange={onChange}
            />
            <Input
                label={'Show Movies widget'}
                type="select"
                name="showMoviesWidget"
                options={[{
                    label: 'Yes',
                    value: 1
                }, {
                    label: 'No',
                    value: 0
                }]}
                value={settings.showMoviesWidget}
                onChange={onChange}
            />
            <button tabIndex={1} type="button" onClick={() => {
                setToStorage('hiddenFree', [])
                notifications({
                    description: 'Hidden free games updated',
                    img: '/assets/controller/save.svg',
                    name: 'Reset successfully',
                    status: 'saving'
                })
            }}>
                Reset hidden free games
            </button>
            <Input
                label={'Alternative achievements (game view)'}
                type="select"
                name="alternativeAchievementsView"
                options={[{
                    label: 'Yes',
                    value: 1
                }, {
                    label: 'No',
                    value: 0
                }]}
                value={settings.alternativeAchievementsView}
                onChange={onChange}
            />
            <button tabIndex={1} type="button" onClick={() => {
                const gamesInList = Object.keys(getFromStorage('games'));
                const playTime = getFromStorage('playTime');
                Object.keys(playTime).forEach((key) => {
                    if (gamesInList.indexOf(key) === -1) delete playTime[key];
                })
                setToStorage('playTime', playTime)
                const lastPlayed = getFromStorage('lastPlayed');
                Object.keys(lastPlayed).forEach((key) => {
                    if (gamesInList.indexOf(key) === -1) delete lastPlayed[key];
                })
                setToStorage('lastPlayed', lastPlayed)
                electronConnector.clearUnusedCache(gamesInList).then(({removed}) => {
                    notifications({
                        description: `Removed ${removed} assets`,
                        img: '/assets/controller/save.svg',
                        name: 'Assets removed',
                        status: 'success'
                    })
                })
            }}>
                Remove unused cache
            </button>
            <Input label='Ryujinx exe path'
                   value={settings.ryujinx}
                   onChange={onChange}
                   type="path"
                   onlyFile={true}
                   name='ryujinx'>
            </Input>
            <SettingsSteamProfile onChange={onChange} steamProfile={settings.steamProfile}/>
            <SettingsWeather/>
            <button tabIndex={1} type="button" onClick={() => {
                setToStorage('config', {settings})
                notifications({
                    description: 'Configuration updated',
                    img: '/assets/controller/save.svg',
                    name: 'Saved successfully',
                    status: 'saving'
                })
                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            }}>
                Save
            </button>
        </div>
    )
}

export default SettingsHome;