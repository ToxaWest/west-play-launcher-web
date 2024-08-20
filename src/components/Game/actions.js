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
    const {updateStatus} = usePlayTime(game)
    const getActive = (e) => e === location.pathname;

    const gameState = {
        'closed': {button: 'play', modifier: ''},
        'starting': {button: 'Starting...', modifier: ''},
        'running': {button: 'Running', modifier: styles.running},
        'hardTracking': {button: 'Running', modifier: styles.running}
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

    const getImageName = () => {
        if (game.imageName) {
            return game.imageName
        }
        return exePath.split('\\').at(-1);
    }

    const getCurrentState = () => {
        return gameState[status]
    }

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
            updateStatus('starting')
            electronConnector.openFile({
                path: exePath,
                parameters: Object.values(game.exeArgs || []).filter((x) => x),
                cwd: game.path,
                imageName: getImageName()
            })
        }
    }

    useEffect(() => {
        init('#game-actions button');
        setActiveIndex(0);
        electronConnector.gameStatus(s => {
            updateStatus(s);
            setStatus(s)
        })
    }, [])

    return (
        <div className={styles.content} id={'game-actions'}>
            <button onClick={start}
                    className={styles.playButton + ' ' + (getCurrentState().modifier)}
                    disabled={status !== 'closed'}
                    style={{backgroundColor: game.color, opacity: exePath ? 1 : 0.7}}
            >
                {getCurrentState().button}
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