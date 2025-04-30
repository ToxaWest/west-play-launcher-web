import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from "./widgets.module.scss";
import Loader from "../Loader";

const FreeWidget = () => {
    const [games, setGames] = useState([]);
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        electronConnector.getFreeGames().then(s => {
            setGames(s);
            setLoading(false);
        })
    }, []);


    const renderTime = ({endTime, startTime}) => {
        const dateFormatter = (t) => new Date(parseInt(t) * 1000).toLocaleDateString()
        if (endTime) {
            return `${dateFormatter(startTime)} - ${dateFormatter(endTime)}`
        }

        return `From ${dateFormatter(startTime)}`
    }

    const getFields = (currentGame) => {
        return [{
            label: 'Name',
            value: currentGame.name,
        }, {
            label: 'Store',
            value: currentGame.shopName
        }, {
            label: 'Free period',
            value: renderTime(currentGame)
        }, {
            label: 'Store Link',
            value: currentGame.link ?
                <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                    electronConnector.openLink(currentGame.link)
                }}>Link</div> : null
        }]
    }

    const renderDescription = (game) => {
        const fields = getFields(game)
        return (<ul>
            {fields.map((field, i) => (
                <li key={i}>
                    <strong>{field.label}:</strong><i>{field.value}</i>
                </li>
            ))}
        </ul>)
    }

    const renderGame = (game) => {
        const enabled = active === game.id
        return (
            <li key={game.id}
                tabIndex={1}
                className={enabled ? styles.active : ""}
                onBlur={() => {
                    setActive(0);
                }}
                onFocus={() => {
                    setActive(game.id);
                }}>
                <img src={game.short_image} alt={game.title} loading={"lazy"}/>
                {enabled ? renderDescription(game) : null}
            </li>
        )
    }

    return (
        <ul className={styles.freeWrapper}>
            {games.map(renderGame)}
            <Loader loading={loading}/>
        </ul>
    )
}

export default FreeWidget