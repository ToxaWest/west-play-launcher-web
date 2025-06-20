import {useEffect, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from './settingsImport.module.scss';
import Loader from "../../Loader";
import useNotification from "../../../hooks/useNotification";

const SettingsImportSteam = () => {
    const [list, setList] = useState([]);
    const games = getFromStorage('games');
    const [loading, setLoading] = useState(true);
    const notifications = useNotification();
    useEffect(() => {
        electronConnector.getInstalledSteam().then(r => {
            setLoading(false);
            setList(r);
        })
    }, []);

    const renderItem = (item) => {
        const installed = games.some(({steamId}) => steamId === item.steamId)

        return (
            <li key={item.id}>
                <img src={item.img_grid} alt={item.name}/>
                <div className={styles.content}>
                    <h2>{item.name}</h2>
                    {installed ? <span/> : <button tabIndex={1} onClick={() => {
                        setToStorage('games', [item, ...games]);
                        notifications({
                            img: '/assets/controller/save.svg',
                            status: 'saving',
                            name: 'Saved successfully',
                            description: 'Configuration updated'
                        })
                    }}>Install</button>}
                    <div>
                        <strong>ID:</strong> <i>{item.steamId}</i>
                        <br/>
                        {installed && <button
                            tabIndex={1}
                            onClick={() => {
                                const index = games.findIndex(({steamId}) => steamId === item.steamId);
                                if (!index) return;
                                games[index] = {...games[index], ...item};
                                setToStorage('games', games);
                                notifications({
                                    img: '/assets/controller/save.svg',
                                    status: 'saving',
                                    name: 'Saved successfully',
                                    description: 'Configuration updated'
                                })
                            }}>Update</button>}
                    </div>
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
        </div>
    )
}

export default SettingsImportSteam;