import styles from "./game.module.scss";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";
import useStartGame from "../../hooks/useStartGame";

const GameActions = ({game}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {init, setActiveIndex} = useAppControls({map: {right: (i) => i + 1, left: (i) => i - 1, rb: (i) => i + 1, lb: (i) => i - 1}})
    const {start, status, exePath} = useStartGame(game)
    const getActive = (e) => e === location.pathname;

    const gameState = {
        'closed': {button: 'play', modifier: ''},
        'starting': {button: 'Starting...', modifier: ''},
        'running': {button: 'Running', modifier: styles.running},
    }

    useEffect(() => {
        init('#game-actions button');
        //prevent random start
        setTimeout(() => {
            setActiveIndex(0);
        }, 500)
    }, [])

    const buttons = [{
        url: `/game/${game.id}`,
        img: '/assets/content.svg'
    }, {
        url: `/game/${game.id}/achievements`,
        img: '/assets/achievement.svg'
    }, {
        url: `/game/${game.id}/media`,
        img: '/assets/media.svg'
    }]

    return (
        <div className={styles.content} id={'game-actions'}>
            <button onClick={start}
                    className={styles.playButton + ' ' + (gameState[status].modifier)}
                    disabled={status !== 'closed'}
                    style={{opacity: exePath ? 1 : 0.7}}
            >
                {gameState[status].button}
            </button>
            {buttons.map(({url, img}) => (
                <button
                    key={url}
                    onClick={() => {
                        navigate(url)
                    }}
                    className={styles.icon + (getActive(url) ? ' ' + styles.activeIcon : '')}
                >
                    <img src={img} alt={'content'}/>
                </button>
            ))}
        </div>
    )
}

export default GameActions;