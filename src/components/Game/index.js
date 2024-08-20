import {Outlet, useParams} from "react-router-dom";
import styles from "./game.module.scss";
import {useEffect} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import getAchievements from "../../helpers/getAchievements";
import useAchievementsWatcher from "../../hooks/useAchievementsWatcher";
import GameActions from "./actions";

const Game = () => {
    const {id} = useParams();

    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const achievementsWatcher = useAchievementsWatcher(game.id)

    useEffect(() => {
        getAchievements(id)
        achievementsWatcher.init()
        return () => {
            achievementsWatcher.destroy()
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.heading}>
                <img src={game.img_logo} className={styles.logo} alt={'logo'}/>
                <img src={game.img_hero} alt={game.name}/>
            </div>
            <GameActions game={game}/>
            <Outlet/>
        </div>
    )
}

export default Game;