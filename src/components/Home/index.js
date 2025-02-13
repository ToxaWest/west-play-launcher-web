import styles from "./home.module.scss";
import {useEffect, useState} from "react";
import FreeWidget from "./free.widget";
import CrackedWidget from "./cracked.widget";
import PlayedWidget from "./played.widget";
import {getColorByUrl} from "../../helpers/getColor";
import setTheme from "../../helpers/setTheme";
import {secondsToHms} from "../../hooks/usePlayTime";
import {getFromStorage} from "../../helpers/getFromStorage";
import useFooterActions from "../../hooks/useFooterActions";

const Home = () => {
    const [game, setGame] = useState({});
    const {setFooterActions} = useFooterActions()
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

    const renderDevelopers = (devs) => {
        if (!devs) {
            return null
        }
        return devs.filter((dev) => dev).join(', ');
    }


    const sources = {
        'steam': 'Steam',
        'egs': 'Epic Games Store',
        'origin': 'Electronic Arts',
        'gog': 'GOG',
        'ryujinx': 'Nintendo Switch™'
    }

    const infoData = [{
        label: 'Last played',
        value: getFromStorage('lastPlayed')[game.id] ? new Date(getFromStorage('lastPlayed')[game.id]).toLocaleDateString() : null
    }, {
        label: 'Play time',
        value: getFromStorage('playTime')[game.id] ? secondsToHms(getFromStorage('playTime')[game.id]) : null
    }, {
        label: 'Size',
        value: game.size
    }, {
        label: 'Store',
        value: sources[game.source]
    }, {
        label: 'Licensed',
        value: !game.unofficial ? 'Yes' : 'No'
    }, {
        label: 'Metacritics',
        value: game.metacritic?.score
    }, {
        label: 'Release date',
        value: game.release_date?.date
    }, {
        label: 'Players',
        value: game.players
    }, {
        label: 'PEGI rating',
        value: game.required_age
    }, {
        label: 'Developers',
        value: renderDevelopers(game.developers)
    }, {
        label: 'Languages',
        value: game.supported_languages ? <span dangerouslySetInnerHTML={{__html: game.supported_languages}}/> : null
    }]

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
                    <div className={styles.info}>
                        <h1>{game.name}</h1>
                        <ul>
                            {infoData.filter(({value}) => Boolean(value))
                                .map(({label, value}) => (
                                    <li key={label}>
                                        <strong>{label}:</strong>
                                        {value}
                                    </li>
                                ))}
                        </ul>
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