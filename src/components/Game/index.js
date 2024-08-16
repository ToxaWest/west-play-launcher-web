import {useParams} from "react-router-dom";
import styles from "./game.module.scss";
import electronConnector from "../../helpers/electronConnector";
import useNotification from "../../hooks/useNotification";
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";

const Game = () => {
    const {id} = useParams();
    const notification = useNotification();
    const {init} = useAppControls({
        map: {
            right: (i) => i + 1,
            left: (i) => i - 1,
        }
    })
    const game = JSON.parse(localStorage.getItem('games')).find(({id: gid}) => gid.toString() === id);

    console.log(game)

    const getImageName = () => {
        if (game.imageName) {
            return game.imageName
        }
        return game.exePath.split('\\').at(-1);
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
                id: game.id
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
        document.addEventListener('keydown', (event) => {
            console.log(event)
        })
    }, []);

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
                <button onClick={start} className={styles.playButton} style={{backgroundColor: game.color}}>Play</button>
            </div>
            <div className={styles.content}>
                <div className={styles.description}>
                    <h1>{game.name}</h1>
                    {game.img_landscape && <img src={game.img_landscape} alt={'landscape'}
                                                style={{maxWidth: '100%', borderRadius: '8px'}}/>}
                    {game.about_the_game && <div dangerouslySetInnerHTML={{__html: game.about_the_game}}/>}
                    {game.pc_requirements && <div className={styles.requirements}>
                        <div dangerouslySetInnerHTML={{__html: game.pc_requirements.minimum}}/>
                        <div dangerouslySetInnerHTML={{__html: game.pc_requirements.recommended}}/>
                    </div>
                    }
                </div>
                <div className={styles.info} style={{backgroundColor: game.color}}>
                    <ul>
                        <li>
                            <strong>Size:</strong>
                            {game.size}
                        </li>
                        <li>
                            <strong>Metacritics:</strong>
                            {game.metacritic?.score}
                        </li>
                        <li>
                            <strong>Release date:</strong>
                            {game.release_date?.date}
                        </li>
                        <li>
                            <strong>Controller support:</strong>
                            {game.controller_support}
                        </li>
                        <li>
                            <strong>PEGI rating:</strong>
                            {game.required_age}
                        </li>
                        <li>
                            <strong>Developers:</strong>
                            {game.developers?.map(a => <span key={a}>{a},</span>)}
                        </li>

                    </ul>
                    <strong>Languages:</strong>
                    <div dangerouslySetInnerHTML={{__html: game.supported_languages}}/>
                </div>
            </div>
        </div>
    )
}

export default Game;