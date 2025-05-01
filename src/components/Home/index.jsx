import styles from "./home.module.scss";
import {useEffect, useState} from "react";
import FreeWidget from "./free.widget";
import CrackedWidget from "./cracked.widget";
import PlayedWidget from "./played.widget";
import {getColorByUrl} from "../../helpers/getColor";
import setTheme from "../../helpers/setTheme";
import useFooterActions from "../../hooks/useFooterActions";
import {getFromStorage} from "../../helpers/getFromStorage";

const Home = () => {
    const [game, setGame] = useState({});
    const {setFooterActions} = useFooterActions()
    const {coloredGames} = getFromStorage('config').settings;
    const getUrl = (url) => {
        if (!url) return ''

        return new URL(url).toString()
    }

    useEffect(() => {
        setFooterActions({})
        return () => {
            document.querySelector(':root').style = null;
        }
    }, [])

    const renderDescription = () => {
        if (game.short_description) {
            return (
                <p>
                    {game.short_description}
                </p>
            )
        }
        return null
    }

    const getAchCount = (a) => Object.values(a).filter(({earned, progress}) => {
        if (!earned) {
            return false
        }
        if (progress) {
            return progress === 1
        }
        return true
    }).length

    const renderAchievements = () => {
        if (game.achievements) {
            const ach = getFromStorage('achievements')[game.id] || {}

            return <div className={styles.achievements}>
                <span>Achievements: </span>
                {getAchCount(ach)} of {Object.keys(game.achievements).length}
            </div>
        }
        return null
    }

    return (
        <div className={styles.wrapper} style={{backgroundImage: `url('${getUrl(game.img_hero)}')`}}>
            <div className={styles.innerWrapper}>
                <PlayedWidget setGame={g => {
                    if (coloredGames) {
                        getColorByUrl(g.img_hero).then(color => {
                            const theme = setTheme(color);
                            Object.entries(theme).forEach(([key, value]) => {
                                document.querySelector(':root').style.setProperty(key, value)
                            })
                        })
                    }
                    setGame(g)
                }}/>
                <div className={styles.game}>
                    <img src={game.img_grid} alt={game.title} loading={"lazy"}/>
                    <div className={styles.info}>
                        <h1>{game.name}</h1>
                        {renderDescription()}
                        {renderAchievements()}
                    </div>
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