import {useEffect, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from './settingsImport.module.scss';
import Loader from "../../Loader";
import useNotification from "../../../hooks/useNotification";

const SettingsImportNintendo = () => {
    const [list, setList] = useState([]);
    const games = getFromStorage('games');
    const [loading, setLoading] = useState(true);
    const notifications = useNotification();
    useEffect(() => {
        electronConnector.getInstalledRyujinx().then(r => {
            setLoading(false);
            setList(r);
        })
    }, []);

    const renderItem = (item) => {
        const installed = games.some(({nspId}) => nspId === item.nspId)
        return (
            <li key={item.id}>
                {item.originalImage ? <img src={item.originalImage} alt={item.name}/> : null}
                <div className={styles.content}>
                    <h2>{item.name}</h2>
                    {installed ? <span/> : <button tabIndex={1} onClick={() => {
                        setLoading(true);
                        electronConnector.getRyujinxGameData(item).then(g => {
                            setToStorage('games', [g, ...games]);
                            notifications({
                                img: '/assets/controller/save.svg',
                                status: 'saving',
                                name: 'Saved successfully',
                                description: 'Configuration updated'
                            })
                            setLoading(false);
                        })
                    }}>Install</button>}
                    <div>
                        <button onClick={() => {
                            electronConnector.openLink(item.storeUrl)
                        }}>Store</button>
                        <div>
                            {installed && <button
                                tabIndex={1}
                                onClick={() => {
                                    const index = games.findIndex(({nspId}) => nspId === item.nspId);
                                    if (!index) return;
                                    setLoading(true);
                                    electronConnector.getRyujinxGameData(item).then(g => {
                                        games[index] = {...games[index], ...g};
                                        setToStorage('games', games);
                                        notifications({
                                            img: '/assets/controller/save.svg',
                                            status: 'saving',
                                            name: 'Saved successfully',
                                            description: 'Configuration updated'
                                        })
                                        setLoading(false);
                                    })
                                }}>Update</button>}
                        </div>
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

export default SettingsImportNintendo;