import styles from "./lastcracked.module.scss";
import {useEffect, useRef, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import useAppControls from "../../hooks/useAppControls";
import {currentLang} from "../../helpers/locales";
import RenderContent from "../Game/renderContent";
import RenderMedia from "../Game/renderMedia";
import getColor from "../../helpers/getColor";

const LastCracked = () => {
    const [games, setGames] = useState([]);
    const [steam, setSteam] = useState(null);
    const wrapperRef = useRef(null);
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

    const currentGame = games[currentIndex];

    return (
        <>
            <div className={styles.wrapper} ref={wrapperRef}>
                <h2>Cracked Games</h2>
                <ul id={'cracked'}>
                    {games.map(game => (
                        <li key={game.id} aria-label={game.name} tabIndex={1} onFocus={(e) => {
                            const color = getColor(e.target.children[0])
                            wrapperRef.current.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
                        }}>
                            <img src={game.short_image} alt={game.title}/>
                        </li>
                    ))}
                </ul>
            </div>
            {steam && (
                <>
                    <RenderContent game={steam} fields={[{
                        label: 'Status',
                        value: currentGame.readable_status
                    }, {
                        label: 'Hacked Groups',
                        value: currentGame.hacked_groups
                    }, {
                        label: 'protections',
                        value: currentGame.protections
                    }, {
                        label: 'Torrent (not recommended)',
                        value: currentGame.torrent_link ?
                            <a href={currentGame.torrent_link} target="_blank">Link</a> : null
                    }, {
                        label: 'Cracked',
                        value: new Date(currentGame.crack_date).toLocaleDateString()
                    }]}/>
                    <RenderMedia game={steam}/>
                </>
            )}
        </>

    )
}

export default LastCracked