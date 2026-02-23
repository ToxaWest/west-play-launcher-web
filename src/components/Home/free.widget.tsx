import React from "react";
import type {freeGameType} from "@type/widget.types";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

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
        return (<ul className="absolute inset-0 opacity-0 overflow-hidden transition-opacity duration-300 z-[-1] w-full h-full p-gap-half flex flex-col gap-gap-half bg-theme group-focus:opacity-90 group-focus:z-[1] group-hover:opacity-90 group-hover:z-[1]">
            {fields.map((field) => (
                <li key={field.label} className="list-none m-0 flex border-b border-secondary">
                    <strong className="mr-gap-half">{field.label}:</strong><i className="ml-auto text-right">{field.value}</i>
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
                className={`group whitespace-nowrap aspect-[92/43] w-[22vw] rounded-theme relative overflow-hidden transition-all duration-300 ease-in-out perspective-[1000px] hover:z-[2] hover:translate-x-[calc(1.8vw-var(--gap))] hover:scale-115 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] focus:z-[2] focus:translate-x-[calc(1.8vw-var(--gap))] focus:scale-115 focus:shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:z-[2] active:translate-x-[calc(1.8vw-var(--gap))] active:scale-115 active:shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${enabled ? "bg-text-secondary z-[2]" : ""}`}
                onClick={() => setActive(game.appid)}
                onBlur={() => {
                    setActive(0);
                }}>
                <img src={game.image} alt={game.title} loading={"lazy"} className="object-cover h-full w-full" />
                {renderDescription(game)}
            </li>
        )
    }

    if(!games) return null
    const list = games.filter(({appid}) => !getFromStorage('hiddenFree').includes(appid))
    if (list.length === 0) return null;

    return (
        <React.Fragment>
            <h2 className="p-theme relative z-[2]">{i18n.t('Free Games')}</h2>
            <div className="w-screen glass">
                <ul className="gap-gap grid grid-rows-[repeat(1,1fr)] justify-start grid-flow-col overflow-x-auto list-none relative py-[1.1vw] px-gap min-h-[80px]">
                    {list.map(renderGame)}
                    <Loader loading={loading}/>
                </ul>
            </div>
        </React.Fragment>
    )
}

export default FreeWidget