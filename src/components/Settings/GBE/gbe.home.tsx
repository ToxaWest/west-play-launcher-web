import React, {useEffect} from "react";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Loader from "../../Loader";

import styles from "./gbe.module.scss";

const GBEHome = () => {
    const [loading, setLoading] = React.useState(false);
    const [installed, setInstalled] = React.useState(false);
    const [gbeData, setGbeData] = React.useState<any[]>([])
    const games = getFromStorage('games');

    const gbeReadyGames = games.filter(({source, unofficial, archive}) => {
        return source === 'steam' && unofficial && !archive;
    })

    const checkGBE = (id, path) => {
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
            installed: { path: string, name: string }[]
            notInstalled: { current: { path: string, name: string }, gbe: { path: string, name: string } }[]
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
                {installed.map(a => (
                    <li key={a.path} style={getStyle(true)}>
                        <span>{a.name}</span>
                        <span>{a.path}</span>
                    </li>
                ))}
                {notInstalled.map(({current: a, gbe}) => (
                    <li key={a.path} style={getStyle(false)}>
                        <span>{a.name}</span>
                        <span>{a.path}</span>
                        <button type={"button"} onClick={() => {
                            electronConnector.gbeActions({
                                data: {current: a.path, source: gbe.path},
                                event: 'copyGBE'
                            }).then(() => {
                                checkGBE(id, path)
                            })
                        }}>Install
                        </button>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.gbeStatus}>
                {installed ? <p className={installed ? styles.gbeStatusReady : ''}>{i18n.t('GBE is ready')}</p> :
                    <p>{i18n.t('GBE is not ready')}</p>}
                <button
                    type={'button'}
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
                                onClick={() => {
                                    checkGBE(id, path)
                                }}>Chek GBE
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