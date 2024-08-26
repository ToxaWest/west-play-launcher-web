import styles from "./lastcracked.module.scss";
import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import useAppControls from "../../hooks/useAppControls";
import {currentLang} from "../../helpers/locales";
import RenderContent from "../Game/renderContent";
import RenderMedia from "../Game/renderMedia";

const LastCracked = () => {
    const [games, setGames] = useState([]);
    const [steam, setSteam] = useState(null);
    const {init, currentIndex} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1,
        }
    })

    useEffect(() => {
        electronConnector.crackWatchRequest({
            "type": "Last cracked games",
            "limit": 16,
            "sortBy": "crack_date",
            "sortDirection": "desc",
            "showAAA": false
        }).then((g) => {
            setGames(g.games);
            setTimeout(() => {
                init('#cracked li')
            }, 500)
        })
    }, [])

    useEffect(() => {
        console.log(currentIndex)
        if (games[currentIndex]) {
            const {steam_prod_id} = games[currentIndex];
            if (steam_prod_id) {
                electronConnector.getSteamData({
                    appID: steam_prod_id,
                    lang: currentLang()
                }).then((data) => {
                    setSteam(data[steam_prod_id].data)
                })
            } else {
                setSteam(null)
            }
        }

    }, [currentIndex, games])

    return (
        <>
            <div className={styles.wrapper}>
                <ul id={'cracked'}>
                    {games.map(game => (
                        <li key={game.id} aria-label={game.name} tabIndex={1}>
                            <img src={game.short_image} alt={game.title}/>
                            <div className={styles.info}>
                                <div>Released: {new Date(game.release_date).toLocaleDateString()}</div>
                                <div>Cracked: {new Date(game.crack_date).toLocaleDateString()}</div>
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
            {steam && (
                <>
                    <RenderContent game={steam}/>
                    <RenderMedia game={steam}/>
                </>
            )}
        </>

    )
}

export default LastCracked