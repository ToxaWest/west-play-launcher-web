import React from "react";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import {locales} from "../../helpers/locales";
import type {freeGameType} from "../../types/widget.types";
import Loader from "../Loader";

import styles from "./widgets.module.scss";

interface StyleInterface extends React.CSSProperties {
    '--lines': string
}

const FreeWidget = () => {
    const [active, setActive] = React.useState(0);

    const [games, action, loading] = React.useActionState(electronConnector.getFreeGames, [])
    React.useEffect(() => React.startTransition(action), [])

    const renderTime = (time?: string) => {
        const {webapi} = locales.find(a => a.value === getFromStorage('config').settings.currentLang)
        const dateFormatter = (t: string) => new Date(parseInt(t) * 1000).toLocaleDateString(webapi) + ' ' + new Date(parseInt(t) * 1000).toLocaleTimeString(webapi)
        if (!time) return null;
        return dateFormatter(time)
    }

    const getFields = (currentGame: freeGameType) => {
        return [{
            label: 'Name',
            value: currentGame.name,
        }, {
            label: 'Store Link',
            value: <span style={{cursor: 'pointer'}} role="link" tabIndex={0} onClick={() => {
                if (currentGame.link) electronConnector.openLink(currentGame.link)
            }}>{currentGame.shopName}</span>
        }, {
            label: 'Price',
            value: currentGame.price
        }, {
            label: 'Free from',
            value: renderTime(currentGame.startTime)
        }, {
            label: 'Free to',
            value: renderTime(currentGame.endTime)
        }, {
            label: 'Hide this game',
            value: <span style={{cursor: 'pointer'}} role="button" tabIndex={0} onClick={() => {
                setToStorage('hiddenFree', [...getFromStorage('hiddenFree'), currentGame.id]);
                React.startTransition(action)
            }}>Hide</span>
        }]
    }

    const renderDescription = (game: freeGameType) => {
        const fields = getFields(game).filter(({value}) => value)
        return (<ul>
            {fields.map((field) => (
                <li key={field.label}>
                    <strong>{field.label}:</strong><i>{field.value}</i>
                </li>
            ))}
        </ul>)
    }

    const renderGame = (game: freeGameType) => {
        const enabled = active === game.id
        return (
            <li key={game.id}
                tabIndex={1}
                role="button"
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

    const style: StyleInterface = {'--lines': '1'}

    return (
        <React.Fragment>
            <h2>Free Games</h2>
            <ul className={styles.freeWrapper} style={style}>
                {games.filter(({id}) => !getFromStorage('hiddenFree').includes(id)).map(renderGame)}
                <Loader loading={loading}/>
            </ul>
        </React.Fragment>
    )
}

export default FreeWidget