import styles from "./game.module.scss";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import usePlayTime from "../../hooks/usePlayTime";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import useNotification from "../../hooks/useNotification";
import useAppControls from "../../hooks/useAppControls";

const GameActions = ({game}) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('closed');
    const location = useLocation();
    const notification = useNotification();
    const {init, setActiveIndex} = useAppControls({map: {right: (i) => i + 1, left: (i) => i - 1}})
    const playTime = usePlayTime(game)
    const getActive = (e) => e === location.pathname;

    const gameState = {
        'closed': {button: 'play', modifier: ''},
        'starting': {button: 'Starting...', modifier: ''},
        'running': {button: 'Running', modifier: styles.running},
    }

    const lastPlayed = getFromStorage('lastPlayed');
    const {settings} = getFromStorage('config');

    const getGamePath = () => {
        const list = {
            steam: game.exePath,
            ryujinx: settings.ryujinx,
            rpcs3: settings.rpcs3
        }
        return list[game.source]
    }

    const exePath = getGamePath();

    const start = () => {
        setToStorage('lastPlayed', {...lastPlayed, [game.id]: new Date().getTime()});
        notification({
            status: exePath ? 'success' : 'error',
            img: game.img_icon,
            name: exePath ? 'Starting...' : 'Can\'t start',
            description: game.name,
        })
        if (exePath) {
            setStatus('starting')
            electronConnector.openFile({
                path: exePath,
                parameters: Object.values(game.exeArgs || {}).filter((x) => x),
                imageName: game.imageName
            })
        }
    }

    useEffect(() => {
        init('#game-actions button');
        setActiveIndex(0);
        electronConnector.gameStatus(_status => {
            if(_status === 'running'){
                playTime.init()
            } else {
                playTime.destroy()
            }
            setStatus(_status)
        })
    }, [])

    return (
        <div className={styles.content} id={'game-actions'}>
            <button onClick={start}
                    className={styles.playButton + ' ' + (gameState[status].modifier)}
                    disabled={status !== 'closed'}
                    style={{backgroundColor: game.color, opacity: exePath ? 1 : 0.7}}
            >
                {gameState[status].button}
            </button>
            <button
                onClick={() => {
                    navigate(`/game/${game.id}`)
                }}
                className={styles.icon + (getActive(`/game/${game.id}`) ? ' ' + styles.activeIcon : '')}
                style={{backgroundColor: game.color}}
            >
                <img src={'/assets/content.svg'} alt={'content'}/>
            </button>
            <button
                onClick={() => {
                    navigate(`/game/${game.id}/achievements`)
                }}
                className={styles.icon + (getActive(`/game/${game.id}/achievements`) ? ' ' + styles.activeIcon : '')}
                style={{backgroundColor: game.color}}
            >
                <img src={'/assets/achievement.svg'} alt={'achievement'}/>
            </button>
        </div>
    )
}

export default GameActions;