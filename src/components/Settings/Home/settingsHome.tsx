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

const Section = ({title, children}: {title: string, children: React.ReactNode}) => (
    <div className="flex flex-col gap-2 mb-gap">
        <h2 className="text-lg font-bold px-2 opacity-70">{title}</h2>
        <div className="glass p-theme rounded-theme flex flex-col gap-2">
            {children}
        </div>
    </div>
)

const SettingsHome = () => {
    const notifications = useNotification();
    const initialSettings = getFromStorage('config').settings;
    const [settings, setSettings] = React.useState(initialSettings);

    const onChange = ({name, value}) => {
        setSettings(g => ({...g, [name]: value}))
    }

    return (
        <div className="pb-10" id="settingsHome">
            <h1 className="text-2xl font-bold mb-gap px-2">{i18n.t('Settings')}</h1>
            
            <Section title={i18n.t('Display & Interface')}>
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
                <div className="flex gap-gap items-center">
                    <div className="flex-1">
                        <Input label={i18n.t('Live wallpaper')}
                            name="videoBg"
                            value={settings.videoBg}
                            type="path"
                            onlyFile={true}
                            onChange={onChange}
                        />
                    </div>
                    <button type="button" className="m-0 py-1" onClick={() => {
                        onChange({name: 'videoBg', value: ''})
                    }}>
                        {i18n.t('Clear')}
                    </button>
                </div>
            </Section>

            <Section title={i18n.t('Home Widgets')}>
                <Input
                    label={i18n.t('Show cracked widget')}
                    type="select"
                    name="showCrackedWidget"
                    options={[{ label: i18n.t('Yes'), value: 1 }, { label: i18n.t('No'), value: 0 }]}
                    value={settings.showCrackedWidget}
                    onChange={onChange}
                />
                <Input
                    label={i18n.t('Show free widget')}
                    type="select"
                    name="showFreeWidget"
                    options={[{ label: i18n.t('Yes'), value: 1 }, { label: i18n.t('No'), value: 0 }]}
                    value={settings.showFreeWidget}
                    onChange={onChange}
                />
                <Input
                    label={i18n.t('Show Movies widget')}
                    type="select"
                    name="showMoviesWidget"
                    options={[{ label: i18n.t('Yes'), value: 1 }, { label: i18n.t('No'), value: 0 }]}
                    value={settings.showMoviesWidget}
                    onChange={onChange}
                />
            </Section>

            <Section title={i18n.t('Emulators')}>
                <Input label={i18n.t('Ryujinx exe path')}
                    value={settings.ryujinx}
                    onChange={onChange}
                    type="path"
                    onlyFile={true}
                    name='ryujinx'
                />
                <Input label={i18n.t('RPCS3 exe path')}
                    value={settings.rpcs3}
                    onChange={onChange}
                    type="path"
                    onlyFile={true}
                    name='rpcs3'
                />
            </Section>

            <Section title={i18n.t('Profiles & Widgets')}>
                <SettingsSteamProfile onChange={onChange} steamProfile={settings.steamProfile}/>
                <SettingsWeather/>
                <SettingsAlarm value={settings.uaAlarmId} onChange={onChange}/>
            </Section>

            <div className="flex gap-gap mt-10">
                <button tabIndex={1} type="button" className="flex-1 py-3 text-lg font-bold" onClick={() => {
                    setToStorage('config', {settings})
                    notifications({
                        description: i18n.t('Configuration updated'),
                        img: '/assets/controller/save.svg',
                        name: i18n.t('Saved successfully'),
                        status: 'saving'
                    })
                    setTimeout(() => { window.location.reload(); }, 3000)
                }}>
                    {i18n.t('Save')}
                </button>
                <button tabIndex={1} type="button" className="py-3 px-6 bg-red-500/20 hover:bg-red-500/40 text-white border border-red-500/50" onClick={() => {
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
            </div>
        </div>
    )
}

export default SettingsHome;