import React from "react";
import useNotification from "@hook/useNotification";
import type {Game} from "@type/game.types";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Loader from "../../Loader";
import SearchSteamGame from "../Games/searchSteamGame";

import styles from './settingsImport.module.scss';

const SettingsImportSteam = () => {
    const [list, setList] = React.useState<Game[]>([]);
    const games = getFromStorage('games');
    const [loading, setLoading] = React.useState(false);
    const notifications = useNotification();
    const [active, setActive] = React.useState(false);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        electronConnector.getInstalledGames().then(setList)
    }, []);


    const renderActionButton = (item: Game) => {
        const installed = games.some(({id}) => id === item.id)

        return (
            <>
                <button tabIndex={1} type="button" onClick={() => {
                    if (installed) {
                        const index = games.findIndex(({id}) => id === item.id);
                        if (index === -1) return;
                        games[index] = {...games[index], ...item};
                        setToStorage('games', games);
                        window.location.reload()
                        return;
                    }
                    setLoading(true);
                    if (item.source === 'egs') {
                        electronConnector.getSteamId(({searchParams}) => {
                            setSearch(searchParams)
                            setActive(true)
                        })
                    }
                    electronConnector.getDataByGameId(item).then(r => {
                        setToStorage('games', [{...r, ...item}, ...games]);
                        notifications({
                            description: i18n.t('Configuration updated'),
                            img: '/assets/controller/save.svg',
                            name: i18n.t('Saved successfully'),
                            status: 'saving'
                        })
                        if (item.source === 'egs') {
                            window.api.removeAllListeners('getSteamId')
                        }
                        setLoading(false);
                        window.location.reload()
                    })
                }}>
                    {installed ? i18n.t('Update (only local data)') : i18n.t('Install')}
                </button>
                {installed ? <span className={styles.installedIcon}/> : null}
            </>
        )
    }

    const renderItem = (item: Game) => (
        <li key={item.id}>
            {item.img_grid ? <img src={item.img_grid} alt={item.name}/> : null}
            <div className={styles.content}>
                <h2>{item.name}</h2>
                <div><strong>{i18n.t('Source')}:</strong> <i title={item.source}>{item.source}</i></div>
                <div role="button" tabIndex={0} onClick={() => {
                    electronConnector.openLink(item.path)
                }}>
                    <strong>{i18n.t('Folder')}:</strong>
                    <i title={item.path}>{item.path}</i>
                </div>
                <div><strong>{i18n.t('ID')}:</strong> <i title={item.id.toString()}>{item.id}</i></div>
                {renderActionButton(item)}
            </div>
        </li>
    )

    return (
        <div className={styles.wrapper}>
            <ul>
                <Loader loading={loading}/>
                {list.sort((a, b) => a.name.localeCompare(b.name)).map(renderItem)}
            </ul>
            <SearchSteamGame defaultValue={search} active={active} setActive={setActive}/>
        </div>
    )
}

export default SettingsImportSteam;