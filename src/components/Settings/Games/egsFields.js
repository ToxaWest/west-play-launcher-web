import Input from "../../Input";
import useNotification from "../../../hooks/useNotification";
import electronConnector from "../../../helpers/electronConnector";
import {currentLang} from "../../../helpers/locales";
import styles from "../settings.module.scss";
import {useState} from "react";
import formatBytes from "../../../helpers/formatSize";

const EgsFields = ({game, onChange, setGame}) => {
    const [temp, setTemp] = useState([]);
    const {steam_api_key} = JSON.parse(localStorage.getItem('config')).settings;
    const notifications = useNotification();

    const getImage = () => {
        electronConnector.getFile().then(p => {
            const imageName = p.split('\\').at(-1);
            setGame(g => ({...g, imageName}))
        })
    }

    const getGamePath = () => {
        electronConnector.getEgsId().then(({path, size, AppName}) => {
            const exePath = `com.epicgames.launcher://apps/${AppName}?action=launch&silent=true`;
            setGame(g => ({...g, path, size: formatBytes(parseInt(size)), exePath}))
        })
    }

    const getSteamData = (steamId) => {
        electronConnector.getSteamData({
            appID: steamId,
            lang: currentLang()
        }).then((r) => {
            const {
                about_the_game,
                name,
                release_date,
                pc_requirements,
                developers,
                controller_support,
                required_age,
                metacritic,
                supported_languages,
                movies,
                screenshots
            } = r[steamId].data;

            setGame(g => {
                return {
                    ...g,
                    steamId,
                    supported_languages,
                    about_the_game,
                    name,
                    release_date,
                    pc_requirements,
                    developers,
                    metacritic,
                    controller_support,
                    required_age,
                    movies,
                    screenshots
                }
            })
            setTemp([])
        })
    }

    const renderAchievements = () => {
        if (game.steamId && steam_api_key) {
            return (
                <button onClick={() => {
                    electronConnector.getSteamAchievements({
                        appID: game.steamId,
                        apiKey: steam_api_key,
                        lang: currentLang()
                    }).then(({game: g}) => {
                        onChange({
                            name: 'achievements',
                            value: g?.availableGameStats?.achievements
                        })
                        notifications({
                            img: '/assets/controller/save.svg',
                            status: 'success',
                            name: 'Achievements updated',
                            description: `${game.name} updated`
                        })
                    })
                }}>GET ACHIEVEMENTS ({game.steamId})
                </button>
            )
        }

        return null;
    }

    return (
        <>
            <Input label='Search'
                   onChange={({value: params}) => {
                       electronConnector.steamSearch({params}).then(setTemp)
                   }}
                   children={<ul className={styles.search}>
                       {temp.map(s => (
                           <li key={s.appid} onClick={() => {
                               getSteamData(s.appid)
                           }}>
                               <img src={s.logo} alt={s.name}/>
                               <span>{s.name}</span>
                           </li>)
                       )}
                   </ul>}
                   name='search'/>
            <Input label='Path'
                   value={game.path}
                   name='path'>
                <button onClick={() => getGamePath()}>Get Folder</button>
            </Input>
            {renderAchievements()}
            <Input label='imageName'
                   value={game.imageName}
                   onChange={onChange}
                   name='imageName'>
                <button onClick={() => getImage()}>Get imageName</button>
            </Input>
        </>
    )
}

export default EgsFields;