import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import styles from "./game.module.scss";
import electronConnector from "../../helpers/electronConnector";
import useNotification from "../../hooks/useNotification";
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";

const Game = () => {
    const {id} = useParams();
    const notification = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const {init} = useAppControls({
        map: {
            right: (i) => i + 1,
            left: (i) => i - 1,
        }
    })
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const lastPlayed = getFromStorage('lastPlayed');
    const getActive = (e) => e === location.pathname;

    const start = () => {
        setToStorage('lastPlayed', {...lastPlayed, [id]: new Date().getTime()});
        notification({
            status: game.exePath ? 'success' : 'error',
            img: game.img_icon,
            name: game.exePath ? 'Starting...' : 'Can\'t start',
            description: game.name,
        })
        if (game.exePath) {
            electronConnector.openFile({
                path: game.exePath,
                parameters: Object.values(game.exeArgs || []).filter((x) => x),
                cwd: game.path,
            })
        }
    }

    useEffect(() => {
        init({
            selector: '#game-actions button'
        })
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.heading}>
                <img src={game.img_logo} className={styles.logo} alt={'logo'}/>
                <img src={game.img_hero} alt={game.name}/>
            </div>
            <div className={styles.content} id={'game-actions'}>
                <button onClick={start} className={styles.playButton} style={{
                    backgroundColor: game.color,
                    opacity: game.exePath ? 1 : 0.7
                }}>
                    Play
                </button>
                <button onClick={() => {
                    navigate(`/game/${id}`)
                }} className={styles.icon + (getActive(`/game/${id}`) ? ' ' + styles.activeIcon : '')}
                        style={{backgroundColor: game.color}}>
                    <img src={'/assets/content.svg'} alt={'content'}/>
                </button>
                <button onClick={() => {
                    navigate(`/game/${id}/achievements`)
                }} className={styles.icon + (getActive(`/game/${id}/achievements`) ? ' ' + styles.activeIcon : '')}
                        style={{backgroundColor: game.color}}>
                    <img src={'/assets/achievement.svg'} alt={'achievement'}/>
                </button>
            </div>
            <Outlet/>
        </div>
    )
}

export default Game;