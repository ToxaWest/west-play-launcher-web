import React from "react";
import type {freeGameType, widgetWrapperStyleInterface} from "@type/widget.types";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

import styles from "./widgets.module.scss";

const getGamesList = async (): Promise<freeGameType[]> => {
    try {
        const games = await electronConnector.getFreeGames();
        return games.map((game) => ({
            ...game,
            appid: game.link || game.title,
            shopLink: game.shopLink,
            store: game.shop,
            url: game.link
        }));
    } catch (e) {
        console.log(e)
        return []
    }
}

const FreeWidget = () => {
    const [active, setActive] = React.useState<string | number | null>(null);
    const cache = getFromStorage('list_free_games2');
    const [games, action, loading] = React.useActionState(() => getGamesList(), cache)

    React.useEffect(() => {
        React.startTransition(action)
        return () => {
            if (games) setToStorage('list_free_games2', games)
        }
    }, [])

    const getFields = (currentGame: freeGameType) => {
        return [{
            label: i18n.t('Name'),
            value: currentGame.title,
        }, {
            label: i18n.t('Store Link'),
            value: <span style={{cursor: 'pointer'}} role="link" tabIndex={0} onClick={() => {
                if (currentGame.shopLink) electronConnector.openLink(currentGame.shopLink)
            }}>{currentGame.store}</span>
        }, {
            label: i18n.t('Price'),
            value: currentGame.priceNew || i18n.t('Free')
        }, {
            label: i18n.t('Old Price'),
            value: currentGame.priceOld
        }, {
            label: i18n.t('Hide this game'),
            value: <span style={{cursor: 'pointer'}} role="button" tabIndex={0} onClick={() => {
                setToStorage('hiddenFree', [...getFromStorage('hiddenFree'), currentGame.appid]);
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
                <img src={game.image} alt={game.title} loading={"lazy"} />
                {renderDescription(game)}
            </li>
        )
    }

    const style: widgetWrapperStyleInterface = {'--lines': '1'}
    if(!games) return null
    const list = games.filter(({appid}) => !getFromStorage('hiddenFree').includes(appid))
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