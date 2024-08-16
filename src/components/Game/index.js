import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import styles from "./game.module.scss";
import electronConnector from "../../helpers/electronConnector";
import useNotification from "../../hooks/useNotification";
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";

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
    const game = JSON.parse(localStorage.getItem('games')).find(({id: gid}) => gid.toString() === id);

    const getImageName = () => {
        if (game.imageName) {
            return game.imageName
        }
        return game.exePath.split('\\').at(-1);
    }

    const getActive = (e) => {
        return e === location.pathname
    }

    const start = () => {
        if (game.exePath) {
            notification({
                status: 'success',
                img: game.img_icon,
                name: 'Starting...',
                description: game.name,
            })
            electronConnector.openFile({
                imageName: getImageName(),
                path: game.exePath,
                parameters: Object.values(game.exeArgs || []).filter((x) => x),
                cwd: game.path,
                url: window.location.href,
                id: game.id,
                windowName: game.windowName
            })
        } else {
            notification({
                status: 'error',
                img: game.img_icon,
                name: 'Can\'t start',
                description: game.name,
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
                <button onClick={start} className={styles.playButton} style={{backgroundColor: game.color}}>
                    Play
                </button>
                <button onClick={() => {
                    navigate(`/game/${id}`)
                }} className={styles.icon + (getActive(`/game/${id}`) ? ' ' + styles.activeIcon : '')} style={{backgroundColor: game.color}}>
                    <img src={'/assets/content.svg'} alt={'content'}/>
                </button>
                <button onClick={() => {
                    navigate(`/game/${id}/achievements`)
                }} className={styles.icon + (getActive(`/game/${id}/achievements`) ? ' ' + styles.activeIcon : '')} style={{backgroundColor: game.color}}>
                    <img src={'/assets/achievement.svg'} alt={'achievement'}/>
                </button>
            </div>
            <Outlet/>
        </div>
    )
}

export default Game;