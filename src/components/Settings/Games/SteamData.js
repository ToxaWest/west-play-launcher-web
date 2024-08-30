import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";
import {currentLang} from "../../../helpers/locales";
import {useState} from "react";

const SteamData = ({setGame, game}) => {
    const [temp, setTemp] = useState([]);
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
            setTemp([])
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