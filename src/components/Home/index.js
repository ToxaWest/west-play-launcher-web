import styles from "./home.module.scss";
import {useEffect, useState} from "react";
import FreeWidget from "./free.widget";
import CrackedWidget from "./cracked.widget";
import PlayedWidget from "./played.widget";
import {getColorByUrl} from "../../helpers/getColor";
import setTheme from "../../helpers/setTheme";

const Home = () => {
    const [game, setGame] = useState({});

    const getUrl = (url) => {
        if (!url) return ''

        return new URL(url).toString()
    }

    useEffect(() => {
        return () => {
            document.querySelector(':root').style = null;
        }
    }, [])

    return (
        <div className={styles.wrapper} style={{backgroundImage: `url('${getUrl(game.img_hero)}')`}}>
            <div className={styles.innerWrapper}>
                <PlayedWidget setGame={g => {
                    getColorByUrl(g.img_hero).then(color => {
                        const theme = setTheme(color);
                        Object.entries(theme).forEach(([key, value]) => {
                            document.querySelector(':root').style.setProperty(key, value)
                        })
                    })
                    setGame(g)
                }}/>
                <div className={styles.game}>
                    <img src={game.img_grid} alt={game.title} loading={"lazy"}/>
                    <h1>{game.name}</h1>
                </div>
                <h2>Free Games</h2>
                <FreeWidget/>
                <h2>Cracked Games</h2>
                <CrackedWidget/>
            </div>
        </div>
    )
}

export default Home;