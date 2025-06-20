import {useEffect, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import styles from './settingsImport.module.scss';
import Loader from "../../Loader";
import useNotification from "../../../hooks/useNotification";

const SettingsImportEGS = () => {
    const [list, setList] = useState([]);
    const games = getFromStorage('games');
    const [loading, setLoading] = useState(true);
    const notifications = useNotification();
    useEffect(() => {
        electronConnector.getInstalledEGS().then(r => {
            setLoading(false);
            setList(r);
        })
    }, []);

    const renderItem = (item) => {
        const result = {
            developers: item.developers,
            egsID: item.CatalogNamespace,
            exePath: `com.epicgames.launcher://apps/${item.AppName}?action=launch&silent=true`,
            id: item.CatalogNamespace,
            imageName: item.LaunchExecutable,
            name: item.DisplayName,
            path: item.InstallLocation,
            productId: item.id,
            short_description: item.shortDescription,
            source: 'egs',
            storeUrl: item.storeUrl,
            size: item.size,
            type: 'game',
            buildVersion: item.AppVersionString,
            unofficial: false,
        }
        const installed = games.some(({egsID}) => egsID === item.CatalogNamespace)

        return (
            <li key={item.CatalogItemId}>
                <img src={item.media.card3x4?.imageSrc || item.media.logo?.imageSrc} alt={item.title}/>
                <div className={styles.content}>
                    <h2>{item.DisplayName}</h2>
                    {installed ? <span/> : <button tabIndex={1} onClick={() => {
                        setToStorage('games', [result, ...games]);
                        notifications({
                            img: '/assets/controller/save.svg',
                            status: 'saving',
                            name: 'Saved successfully',
                            description: 'Configuration updated'
                        })
                    }}>Install</button>}
                    <div>
                        {item.shortDescription}
                        <div>
                            {installed && <button
                                tabIndex={1}
                                onClick={() => {
                                    const index = games.findIndex(({egsID}) => egsID === item.CatalogNamespace);
                                    if (!index) return;
                                    games[index] = {...games[index], ...result};
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
                </div>
            </li>
        )
    }

    return (
        <div className={styles.wrapper}>
            <ul>
                <Loader loading={loading}/>

                {list.sort((a, b) => a.DisplayName.localeCompare(b.DisplayName)).map(renderItem)}
            </ul>
        </div>
    )
}

export default SettingsImportEGS;