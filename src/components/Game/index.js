import {useParams} from "react-router-dom";
import styles from "./game.module.scss";
import electronConnector from "../../helpers/electronConnector";

const Game = () => {
    const {id} = useParams();
    const game = JSON.parse(localStorage.getItem('games')).find(({id: gid}) => gid.toString() === id);

    return (
        <div className={styles.wrapper}>
            <div className={styles.heading}>
                <img src={game.img_logo} className={styles.logo} alt={'logo'}/>
                <img src={game.img_hero} alt={game.name}/>
            </div>
            <div className={styles.content}>
                {game.exePath && <button onClick={() => {
                    electronConnector.openFile({
                        path: game.exePath,
                        parameters: Object.values(game.exeArgs || []).filter((x) => x),
                        cwd: game.path,
                    })
                }}>
                    Play
                </button>}
            </div>
            <div className={styles.content} style={{backgroundColor: game.color}}>
                <div className={styles.description}>
                    <h1>{game.name}</h1>
                    {game.about_the_game && <div dangerouslySetInnerHTML={{__html: game.about_the_game}}/>}
                    {game.pc_requirements && <div className={styles.requirements}>
                        <div dangerouslySetInnerHTML={{__html: game.pc_requirements.minimum}}/>
                        <div dangerouslySetInnerHTML={{__html: game.pc_requirements.recommended}}/>
                    </div>
                    }
                </div>
                <div className={styles.info}>
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