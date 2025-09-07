import React, {useEffect} from "react";
import useNotification from "@hook/useNotification";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Loader from "../../Loader";

import styles from "./gbe.module.scss";

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

        const getStyle = (installed: boolean): React.CSSProperties & {
            '--status-color': string
        } => ({
            '--status-color': installed ? 'var(--earned-color)' : 'red'
        })

        return (
            <ul>
                {installed.map(({current: a, backupExist}) => (
                    <li key={a.path} style={getStyle(true)}>
                        <span>{a.name}</span>
                        <span>{a.path}</span>
                        {backupExist && <button type={"button"}
                                                tabIndex={1}
                                                onClick={() => {
                                                    electronConnector.gbeActions({
                                                        data: {current: a.path},
                                                        event: 'revertGBE'
                                                    }).then(() => {
                                                        checkGBE(id, path)
                                                    })
                                                }}>
                            {i18n.t('Restore backup')}
                        </button>}
                        {renderSteamSettingsGeneration(a.path, path, id)}
                    </li>
                ))}
                {notInstalled.map(({current: a, gbe}) => (
                    <li key={a.path} style={getStyle(false)}>
                        <span>{a.name}</span>
                        <span>{a.path}</span>
                        <button type={"button"}
                                tabIndex={1}
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
            <button tabIndex={1} type="button" style={{marginLeft: 'auto'}} onClick={() => {
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
            }}>{i18n.t('Generate steam settings')}</button>
        )
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.gbeStatus}>
                <p className={installed ? styles.gbeStatusReady : styles.gbeStatusNotReady}>
                    {installed ? i18n.t('GBE is ready') : i18n.t('GBE is not ready')}
                </p>
                <button
                    type={'button'}
                    tabIndex={1}
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
            <div className={styles.games}>
                {installed ? gbeReadyGames.map(({name, id, path}) => (
                    <div key={id}>
                        <div className={styles.heading}>
                            <span role="button" tabIndex={1} onClick={() => {
                                electronConnector.openLink(path)
                            }}>{name}</span>
                            <button
                                type={'button'}
                                tabIndex={1}
                                onClick={() => {
                                    checkGBE(id, path)
                                }}>{i18n.t('Chek GBE')}
                            </button>
                        </div>
                        {renderGbeData(gbeData[id], id, path)}
                    </div>
                )) : null}
            </div>
            <Loader loading={loading}/>
        </div>
    );
}

export default GBEHome