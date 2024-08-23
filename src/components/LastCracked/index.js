import styles from "./lastcracked.module.scss";
import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import useAppControls from "../../hooks/useAppControls";
import {useNavigate} from "react-router-dom";

const LastCracked = () => {

    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const {init, currentIndex} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1,
            top: () => {
                navigate('/')
            }
        }
    })

    useEffect(() => {
        electronConnector.lastCrackedGames().then((g) => {
            setGames(g);
            setTimeout(() => {
                init('#cracked li')
            }, 500)
        })
    }, [])

    const selectedGame = games[currentIndex]

    const getVideoUrl = (link) => {
        if (link.startsWith("https://www.youtube.com")) {
            const p = new URL(link);
            const video = p.searchParams.get('v');
            const parsms = new URLSearchParams({
                autoplay: 1,
                mute: 1,
                controls: 0,
                loop: 1,
                rel: 0
            })
            return `https://www.youtube.com/embed/${video}?${parsms.toString()}`;
        }

        return <span>{link}</span>
    }

    return (
        <div className={styles.wrapper}>
            <ul id={'cracked'}>
                {games.map(game => (
                    <li key={game.id} aria-label={game.name} tabIndex={1}>
                        <img src={game.short_image} alt={game.title}/>
                        <div className={styles.info}>
                            <div>Released: {game.release_date}</div>
                            <div>Cracked: {game.crack_date}</div>
                        </div>
                    </li>
                ))}
            </ul>
            {selectedGame && (
                <div>
                    <h2>{selectedGame.title}</h2>
                    <div className={styles.video}>
                        {selectedGame.teaser_link ?
                            <iframe width="900" height="506" src={getVideoUrl(selectedGame.teaser_link)}
                                    title="YouTube video player" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> : null}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LastCracked