import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from './freeGames.module.scss';
import useAppControls from "../../hooks/useAppControls";

const FreeGames = () => {
    const [games, setGames] = useState([]);
    const {init, currentIndex} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1,
        }
    })
    useEffect(() => {
        electronConnector.getFreeGames().then((elements) => {
            setGames(elements)
            setTimeout(() => {
                init('#freeGames li')
            }, 500)
        })
    }, []);

    const renderGame = (game) => {
        return (
            <li key={game.containerGameId} tabIndex={1}>
                <img src={game.image} alt={game.name}/>
            </li>
        )
    }

    const renderTime = ({endTime, startTime}) => {
        if (endTime) {
            return (
                <>
                    From <strong>{new Date(parseInt(startTime) * 1000).toLocaleDateString()}</strong> to <strong>{new Date(parseInt(endTime) * 1000).toLocaleDateString()}</strong>
                </>
            )
        }

        return <>From <strong>{new Date(parseInt(startTime) * 1000).toLocaleDateString()}</strong> </>
    }

    const renderDescription = () => {
        const currentGame = games[currentIndex];
        if (currentGame) {
            return (
                <div className={styles.description}>
                    <h2>{currentGame.title}</h2>
                    <h3>{currentGame.shopName}</h3>
                    <span>{renderTime(currentGame)}</span>
                    <button onClick={() => {
                        electronConnector.openLink(currentGame.link)
                    }}>Open link
                    </button>
                </div>
            )
        }

        return null
    }

    return (
        <div className={styles.wrapper}>
            <h2>Free Games</h2>
            <ul id="freeGames">
                {games.map(renderGame)}
            </ul>
            {renderDescription()}
        </div>
    )
}

export default FreeGames;