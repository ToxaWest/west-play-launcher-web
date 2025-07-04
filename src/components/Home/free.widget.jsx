import {startTransition, useActionState, useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from "./widgets.module.scss";
import Loader from "../Loader";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";

const FreeWidget = () => {
    const [active, setActive] = useState(0);

    const hiddenFree = getFromStorage('hiddenFree')
    const [games, action, loading] = useActionState(electronConnector.getFreeGames, [])
    useEffect(() => startTransition(action), [])

    const renderTime = ({startTime}) => {
        const dateFormatter = (t) => new Date(parseInt(t) * 1000).toLocaleDateString()
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
            label: 'Store Link',
            value: currentGame.link ?
                <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                    electronConnector.openLink(currentGame.link)
                }}>Link</div> : null
        }, {
            label: 'Price',
            value: currentGame.price
        },{
            label: 'Free period',
            value: renderTime(currentGame)
        }, {
            label: 'Hide this game',
            value: <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                setToStorage('hiddenFree', [...getFromStorage('hiddenFree'), currentGame.id]);
                startTransition(action)
            }}>Hide</div>
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
                onClick={() => setActive(game.id)}
                onBlur={() => {
                    setActive(0);
                }}>
                <img src={game.short_image} alt={game.title} loading={"lazy"}/>
                {renderDescription(game)}
            </li>
        )
    }

    return (
        <ul className={styles.freeWrapper} style={{'--lines': '1'}}>
            {games.filter(({id}) => !hiddenFree.includes(id)).map(renderGame)}
            <Loader loading={loading}/>
        </ul>
    )
}

export default FreeWidget