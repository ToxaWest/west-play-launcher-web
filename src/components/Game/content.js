import styles from "./game.module.scss";
import {useParams} from "react-router-dom";

const GameContent = () => {
    const {id} = useParams();
    const game = JSON.parse(localStorage.getItem('games')).find(({id: gid}) => gid.toString() === id);

    return (
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

    )

}

export default GameContent