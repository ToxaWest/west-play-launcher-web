import {Outlet, useParams} from "react-router-dom";
import styles from "./game.module.scss";
import {useEffect} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import useAchievementsWatcher from "../../hooks/useAchievementsWatcher";
import GameActions from "./actions";
import setTheme from "../../helpers/setTheme";
import getColor from "../../helpers/getColor";

const Game = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const coloredGames = getFromStorage('config').settings.coloredGames;
    useAchievementsWatcher(game.id);

    useEffect(() => {
        return () => {
            document.querySelector(':root').style = null;
        }
    }, []);

    const imgLoaded = (e) => {
        if(coloredGames) {
            const color = getColor(e.target);
            const theme = setTheme(color);
            Object.entries(theme).forEach(([key, value]) => {
                document.querySelector(':root').style.setProperty(key, value)
            })
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.heading}>
                <div className={styles.logo}>
                    <img src={game.img_logo} alt={'logo'}/>
                </div>
                <img src={game.img_hero} className={styles.hero} alt={game.name} onLoad={imgLoaded}/>
            </div>
            <GameActions game={game}/>
            <Outlet/>
        </div>
    )
}

export default Game;