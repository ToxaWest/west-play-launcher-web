import {Outlet, useParams} from "react-router-dom";
import styles from "../Game/game.module.scss";
import {useEffect} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import setTheme from "../../helpers/setTheme";
import {getColorByUrl} from "../../helpers/getColor";
import Steam_actions from "./steam_actions";

const SteamGame = () => {
    const {id} = useParams();
    const {coloredGames} = getFromStorage('config').settings;

    const game = {
        img_hero: `https://shared.steamstatic.com/store_item_assets/steam/apps/${id}/library_hero_2x.jpg`,
        img_logo: `https://shared.steamstatic.com/store_item_assets/steam/apps/${id}/logo_2x.png`,
        steamId: id,
        id
    }


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
                    <img src={game.img_logo} alt={'logo'} onError={(e) => {
                        if(e.target.hasError) return;
                        e.target.src = `https://shared.steamstatic.com/store_item_assets/steam/apps/${id}/logo.png`
                        e.target.hasError = true
                    }}/>
                </div>
                <img src={game.img_hero} className={styles.hero} alt={game.name} onError={(e) => {
                    if(e.target.hasError) return;
                    e.target.src = `https://shared.steamstatic.com/store_item_assets/steam/apps/${id}/library_hero.jpg`
                    e.target.hasError = true
                }}/>
            </div>
            <Steam_actions game={game}/>
            <Outlet/>
        </div>
    )
}

export default SteamGame;