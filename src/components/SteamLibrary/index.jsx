import styles from '../Library/library.module.scss';
import {useNavigate} from "react-router-dom";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import {startTransition, useActionState, useEffect} from "react";
import useFooterActions from "../../hooks/useFooterActions";
import Loader from "../Loader";

const SteamLibrary = () => {
    const {settings: {steam_api_key, steamid, gamesInRow = 6}} = getFromStorage('config')
    const navigation = useNavigate();
    const {setFooterActions} = useFooterActions()

    const [games, fetchGames, loading] = useActionState(async () => {
        const {response: {steamid: id}} = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steam_api_key}&vanityurl=${steamid}`).then(res => res.json());
        const res = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steam_api_key}&steamid=${id}&format=json`)
        const {response: {games: data}} = await res.json();
        setToStorage('steam_games', data)
        return data
    }, getFromStorage('steam_games') || [])

    useEffect(() => {
        startTransition(fetchGames)
        setFooterActions({})
    }, [])
    const sort = (a, b) => a.rtime_last_played > b.rtime_last_played ? -1 : 1;

    return (
        <div className={styles.wrapper} style={{'--games-in-row': gamesInRow}}>
            <Loader loading={loading}/>
            <ul className={styles.list} id="library-list">
                {games.sort(sort).map((game) => (
                    <li key={game.appid} id={game.appid} tabIndex={1} onClick={() => {
                        window.__back = {id: game.appid, url: '/steam-library'}
                        navigation('/steam-game/' + game.appid)
                    }}>
                        <img
                            src={`https://shared.steamstatic.com/store_item_assets/steam/apps/${game.appid}/library_600x900_2x.jpg`}
                            alt={game.appid}
                            onError={(e) => {
                                e.target.src = `https://shared.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`
                            }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )

}

export default SteamLibrary