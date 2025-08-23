import React from "react";
import type {freeGameType, widgetWrapperStyleInterface} from "@type/widget.types";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import {locales} from "../../helpers/locales";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

import styles from "./widgets.module.scss";

const resolveData = (text: string): freeGameType[] => {
    if (!text) return null;
    const parser = new DOMParser();
    const document = parser.parseFromString(text, 'text/html');
    const list = Array.from(document.querySelectorAll('.deals-content .list-items .game-item'))
    return list.map((item: HTMLDivElement) => {
        const image = (item.querySelector('.game-image img') as HTMLImageElement).srcset.split(',').at(-1).split(' ')[0];
        const link = new URL((item.querySelector('.shop-link') as HTMLLinkElement).href);
        link.host = 'gg.deals'
        link.port = ''
        link.protocol = 'https:'
        return {
            ...item.dataset,
            endTime: (item.querySelector('.game-info-wrapper .game-tags .time-tag .expiry time') as HTMLElement)?.dataset?.timestamp,
            id: item.dataset.containerGameId,
            link: link.href,
            name: item.querySelector('.game-info-wrapper .game-info-title').textContent,
            price: item.querySelector('.game-info-wrapper .price-old')?.innerHTML,
            short_image: image.split('_')[0] + '_616xr353.jpg',
            startTime: (item.querySelector('.game-info-wrapper .game-tags .time-icon-tag time') as HTMLElement)?.dataset?.timestamp,
        } as freeGameType
    })
}


const FreeWidget = () => {
    const [active, setActive] = React.useState(null);
    const cache = getFromStorage('list_free_games');
    const [games, action, loading] = React.useActionState(() => electronConnector.beProxy({
        type: 'text',
        url: 'https://gg.deals/deals/pc/?minDiscount=100&minRating=0'
    }).then(resolveData), cache)

    React.useEffect(() => {
        React.startTransition(action)
        return () => {
            if (games) setToStorage('list_free_games', games)
        }
    }, [])

    const renderTime = (time?: string) => {
        const {webapi} = locales.find(a => a.value === getFromStorage('config').settings.currentLang)
        const dateFormatter = (t: string) => new Date(parseInt(t) * 1000).toLocaleDateString(webapi) + ' ' + new Date(parseInt(t) * 1000).toLocaleTimeString(webapi)
        if (!time) return null;
        return dateFormatter(time)
    }

    const getFields = (currentGame: freeGameType) => {
        return [{
            label: i18n.t('Name'),
            value: currentGame.name,
        }, {
            label: i18n.t('Store Link'),
            value: <span style={{cursor: 'pointer'}} role="link" tabIndex={0} onClick={() => {
                if (currentGame.link) electronConnector.openLink(currentGame.link)
            }}>{currentGame.shopName}</span>
        }, {
            label: i18n.t('Price'),
            value: currentGame.price
        }, {
            label: i18n.t('Free from'),
            value: renderTime(currentGame.startTime)
        }, {
            label: i18n.t('Free to'),
            value: renderTime(currentGame.endTime)
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