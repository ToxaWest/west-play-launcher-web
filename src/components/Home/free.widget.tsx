import React from "react";
import type {freeGameType, widgetWrapperStyleInterface} from "@type/widget.types";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import {locales} from "../../helpers/locales";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

import styles from "./widgets.module.scss";

const getGamesList = async () => {
    const sources = [
        'https://freetokeep.gg/data/gog.json', 'https://freetokeep.gg/data/steam.json', 'https://freetokeep.gg/data/epic.json','https://freetokeep.gg/data/expected.json'
    ]
    const req = [];
    sources.forEach(url => req.push(electronConnector.beProxy({
        type: 'json',
        url: url
    })))
    const res = await Promise.all(req)
    const games = res.map((store, index) => store.map(a => {
        if(index === 0) return {...a, store: 'GOG'}
        if(index === 1) return {...a, store: 'Steam'}
        if(index === 2) return {...a, store: 'Epic Games'}
        return a
    })).flat();
    return games.filter(({expires}) => {
        if(!expires) return true;
        return new Date(expires) > new Date()
    })
}


const FreeWidget = () => {
    const [active, setActive] = React.useState(null);
    const cache = getFromStorage('list_free_games2');
    const [games, action, loading] = React.useActionState(() => getGamesList(), cache)

    React.useEffect(() => {
        getGamesList().then(console.log)
        React.startTransition(action)
        return () => {
            if (games) setToStorage('list_free_games2', games)
        }
    }, [])

    const renderTime = (time?: string) => {
        const {webapi} = locales.find(a => a.value === getFromStorage('config').settings.currentLang)
        const dateFormatter = (t: string) => new Date(t).toLocaleDateString(webapi) + ' ' + new Date(t).toLocaleTimeString(webapi)
        if (!time) return null;
        return dateFormatter(time)
    }

    const getFields = (currentGame: freeGameType) => {
        return [{
            label: i18n.t('Name'),
            value: currentGame.title,
        }, {
            label: i18n.t('Store Link'),
            value: <span style={{cursor: 'pointer'}} role="link" tabIndex={0} onClick={() => {
                if (currentGame.url) electronConnector.openLink(currentGame.url)
            }}>{currentGame.store || currentGame.url}</span>
        }, {
            label: i18n.t('Free from'),
            value: renderTime(currentGame.added)
        }, {
            label: i18n.t('Free to'),
            value: renderTime(currentGame.expires)
        }, {
            label: i18n.t('Hide this game'),
            value: <span style={{cursor: 'pointer'}} role="button" tabIndex={0} onClick={() => {
                setToStorage('hiddenFree', [...getFromStorage('hiddenFree'), currentGame.id]);
                React.startTransition(action)
            }}>{i18n.t('Hide')}</span>
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
        const enabled = active === game.appid
        return (
            <li key={game.appid}
                tabIndex={1}
                role="button"
                className={enabled ? styles.active : ""}
                onClick={() => setActive(game.appid)}
                onBlur={() => {
                    setActive(0);
                }}>
                <img src={game.image} alt={game.title} loading={"lazy"}/>
                {renderDescription(game)}
            </li>
        )
    }

    const style: widgetWrapperStyleInterface = {'--lines': '1'}
    if(!games) return null
    const list = games.filter(({id}) => !getFromStorage('hiddenFree').includes(id))
    if (list.length === 0) return null;

    return (
        <React.Fragment>
            <h2>{i18n.t('Free Games')}</h2>
            <ul className={styles.freeWrapper} style={style}>
                {list.map(renderGame)}
                <Loader loading={loading}/>
            </ul>
        </React.Fragment>
    )
}

export default FreeWidget