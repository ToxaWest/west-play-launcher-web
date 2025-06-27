import {useEffect, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from './settingsImport.module.scss';
import Loader from "../../Loader";
import useNotification from "../../../hooks/useNotification";
import SearchSteamGame from "../Games/searchSteamGame";

const SettingsImportEGS = () => {
    const [list, setList] = useState([]);
    const games = getFromStorage('games');
    const [loading, setLoading] = useState(true);
    const notifications = useNotification();
    const [active, setActive] = useState(false);
    const [search, setSearch] = useState("");
    useEffect(() => {
        electronConnector.getInstalledEGS().then(r => {
            setLoading(false);
            setList(r);
        })
    }, []);

    const renderItem = (item) => {
        const installed = games.some(({egsID}) => egsID === item.egsID)
        return (
            <li key={item.id}>
                <div className={styles.content}>
                    <h2>{item.name}</h2>
                    {installed ? <span/> : <button tabIndex={1} onClick={() => {
                        setLoading(true);
                        electronConnector.getSteamId(({searchParams}) => {
                            setSearch(searchParams)
                            setActive(true)
                        })
                        electronConnector.getDataByGameId(item).then(r => {
                            setToStorage('games', [{...r, ...item}, ...games]);
                            notifications({
                                img: '/assets/controller/save.svg',
                                status: 'saving',
                                name: 'Saved successfully',
                                description: 'Configuration updated'
                            })
                            window.api.removeAllListeners('getSteamId')
                            setLoading(false)
                        })

                    }}>Install</button>}
                    {installed ? <button
                        onClick={() => {
                            const index = games.findIndex(({egsID}) => egsID === item.egsID);
                            if (index === -1) return;
                            games[index] = {...games[index], ...item};
                            setToStorage('games', games);
                            notifications({
                                img: '/assets/controller/save.svg',
                                status: 'saving',
                                name: 'Saved successfully',
                                description: 'Configuration updated'
                            })
                        }}
                    >Update from local data</button>: null}
                </div>
            </li>
        )
    }

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

export default SettingsImportEGS;