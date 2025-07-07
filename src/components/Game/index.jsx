import {Outlet, useParams} from "react-router-dom";
import styles from "./game.module.scss";
import {getFromStorage} from "../../helpers/getFromStorage";
import GameActions from "./actions";

const Game = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    if (!game) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.heading}>
                <div className={styles.logo}>
                    <img src={game.img_logo} alt={'logo'}/>
                </div>
                <img src={game.img_hero} className={styles.hero} alt={game.name}/>
            </div>
            <GameActions game={game}/>
            <Outlet/>
        </div>
    )
}

export default Game;