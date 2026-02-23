import React, {useEffect} from "react";
import useNotification from "@hook/useNotification";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Loader from "../../Loader";

const Section = ({title, children}: {title: string, children: React.ReactNode}) => (
    <div className="flex flex-col gap-2 mb-gap">
        <h2 className="text-lg font-bold px-2 opacity-70">{title}</h2>
        <div className="glass p-theme rounded-theme flex flex-col gap-2">
            {children}
        </div>
    </div>
)

const GBEHome = () => {
    const [loading, setLoading] = React.useState(false);
    const [installed, setInstalled] = React.useState(false);
    const [gbeData, setGbeData] = React.useState<any[]>([])
    const notification = useNotification();
    const games = getFromStorage('games');

    const gbeReadyGames = games.filter(({source, unofficial, archive}) => {
        return source === 'steam' && unofficial && !archive;
    })

    const checkGBE = (id: string | number, path: string) => {
        setLoading(true);
        electronConnector.gbeActions({
            data: {dir: path},
            event: 'checkIsGBEInstalled'
        }).then(data => {
            setLoading(false);
            if (!data.installed) return;
            setGbeData(d => {
                d[id] = data;
                return {...d};
            })
        })
    }

    const checkReady = () => {
        electronConnector.gbeActions({
            event: 'checkIsGBEReady'
        }).then((_installed: boolean) => {
            setInstalled(_installed);
        })
    }

    useEffect(() => {
        checkReady();
    }, []);

    const renderGbeData = (
        data: {
            installed: { current: { path: string, name: string, hash: string }, backupExist: boolean }[]
            notInstalled: { current: { path: string, name: string, hash: string }, gbe: { path: string, name: string, hash: string } }[]
        },
        id: number | string, path: string
    ) => {
        if (!data) return null;
        const {installed, notInstalled} = data;

        return (
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {installed.map(({current: a, backupExist}) => (
                    <li key={a.path} className="flex gap-gap items-center p-2 bg-theme/20 rounded-theme border border-white/5 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-earned before:inline-block">
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-bold truncate">{a.name}</span>
                            <span className="text-xs opacity-50 truncate">{a.path}</span>
                        </div>
                        <div className="flex gap-2">
                            {backupExist && <button type={"button"}
                                                    tabIndex={1}
                                                    className="m-0 py-1"
                                                    onClick={() => {
                                                        electronConnector.gbeActions({
                                                            data: {current: a.path},
                                                            event: 'revertGBE'
                                                        }).then(() => {
                                                            checkGBE(id, path)
                                                        })
                                                    }}>
                                {i18n.t('Restore')}
                            </button>}
                            {renderSteamSettingsGeneration(a.path, path, id)}
                        </div>
                    </li>
                ))}
                {notInstalled.map(({current: a, gbe}) => (
                    <li key={a.path} className="flex gap-gap items-center p-2 bg-theme/20 rounded-theme border border-white/5 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:inline-block">
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-bold truncate">{a.name}</span>
                            <span className="text-xs opacity-50 truncate">{a.path}</span>
                        </div>
                        <button type={"button"}
                                tabIndex={1}
                                className="m-0 py-1"
                                onClick={() => {
                                    electronConnector.gbeActions({
                                        data: {current: a.path, source: gbe.path},
                                        event: 'copyGBE'
                                    }).then(() => {
                                        checkGBE(id, path)
                                    })
                                }}>{i18n.t('Install')}
                        </button>
                    </li>
                ))}
            </ul>
        )
    }

    const renderSteamSettingsGeneration = (dllPath: string, gamePath: string, id: number | string) => {
        return (
            <button tabIndex={1} type="button" className="m-0 py-1" onClick={() => {
                setLoading(true)
                electronConnector.generateSteamSettings({
                    dllPath,
                    gamePath
                }).then(r => {
                    setLoading(false)
                    notification({
                        description: r.message,
                        img: '/assets/controller/save.svg',
                        name: i18n.t('Generate steam settings'),
                        status: r.error ? 'error' : 'success'
                    }, 2000)
                    if (r.data) {
                        games.find((game) => game.id === id).achPath = r.data.achFile;
                        setToStorage('games', games);
                        setTimeout(() => {
                            window.location.reload()
                        }, 1500)
                    }
                })
            }}>{i18n.t('Settings')}</button>
        )
    }

    return (
        <div className="pb-10">
            <h1 className="text-2xl font-bold mb-gap px-2">Goldberg Emulator</h1>
            
            <Section title={i18n.t('Status')}>
                <div className="flex items-center justify-between">
                    <span className={`font-bold ${installed ? 'text-earned' : 'text-red-500'}`}>
                        {installed ? i18n.t('GBE is ready') : i18n.t('GBE is not ready')}
                    </span>
                    <button
                        type={'button'}
                        tabIndex={1}
                        className="m-0 py-1"
                        onClick={() => {
                            setLoading(true);
                            electronConnector.gbeActions({
                                event: 'downloadGBE'
                            }).then(data => {
                                if (data) {
                                    setToStorage('gbe', data);
                                    window.location.reload();
                                }
                                setLoading(false);
                            })
                        }}>
                        {i18n.t('Download GBE')}
                    </button>
                </div>
            </Section>

            {installed && gbeReadyGames.length > 0 && (
                <Section title={i18n.t('Games')}>
                    <div className="flex flex-col gap-4">
                        {gbeReadyGames.map(({name, id, path}) => (
                            <div key={id} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                                    <span role="button" tabIndex={1} className="font-bold cursor-pointer hover:underline truncate mr-2" onClick={() => {
                                        electronConnector.openLink(path)
                                    }}>{name}</span>
                                    <button
                                        type={'button'}
                                        tabIndex={1}
                                        className="m-0 py-1 text-xs"
                                        onClick={() => {
                                            checkGBE(id, path)
                                        }}>{i18n.t('Check')}
                                    </button>
                                </div>
                                {renderGbeData(gbeData[id], id, path)}
                            </div>
                        ))}
                    </div>
                </Section>
            )}
            <Loader loading={loading}/>
        </div>
    );
}

export default GBEHome