import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";
import {currentLang} from "../../../helpers/locales";
import {useState} from "react";
import {getFromStorage} from "../../../helpers/getFromStorage";

const SteamData = ({getGamePath, setGame, game}) => {
    const [temp, setTemp] = useState([]);
    const {steam_api_key} = getFromStorage('config').settings;
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

            setGame(g => ({
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
            }))
            if (steam_api_key && (game.source !== 'egs')) {
                electronConnector
                    .getSteamAchievements({appID: steamId, apiKey: steam_api_key, lang: currentLang()})
                    .then(({game: g}) => {
                        const achievements = g?.availableGameStats?.achievements;
                        setGame(g => ({...g, achievements}))
                        setTemp([])
                    })
            } else {
                setTemp([])
            }
        })
    }

    const getImage = () => {
        electronConnector.getFile().then(p => {
            const imageName = p.split('\\').at(-1);
            setGame(g => ({...g, imageName}))
        })
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
            {getGamePath ? (
                <Input label='Path'
                       value={game.path}
                       name='path'>
                    <button onClick={() => getGamePath()}>Get Folder</button>
                </Input>
            ) : null}
            <Input label='imageName'
                   value={game.imageName}
                   disabled={true}
                   name='imageName'>
                <button onClick={() => getImage()}>Get imageName</button>
            </Input>
        </>
    )
}

export default SteamData;