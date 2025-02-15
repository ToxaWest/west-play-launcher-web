import {Outlet, useParams} from "react-router-dom";
import styles from "./game.module.scss";
import {useEffect} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import GameActions from "./actions";
import setTheme from "../../helpers/setTheme";
import {getColorByUrl} from "../../helpers/getColor";

const Game = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid == id);
    const {coloredGames} = getFromStorage('config').settings;

    useEffect(() => {
        updateThemeColor()
        return () => {
            document.querySelector(':root').style = null;
        }
    }, []);

    const updateThemeColor = () => {
        if (coloredGames) {
            getColorByUrl(game.img_hero).then(color => {
                const theme = setTheme(color);
                Object.entries(theme).forEach(([key, value]) => {
                    document.querySelector(':root').style.setProperty(key, value)
                })
            })
        }
    }

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