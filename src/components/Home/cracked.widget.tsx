import React from "react";
import type {crackedGameType, widgetWrapperStyleInterface} from "@type/widget.types";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

import styles from "./widgets.module.scss";

const CrackedWidget = () => {
    const [active, setActive] = React.useState(null);
    const cache: crackedGameType[] = localStorage.getItem('list_crack_games') ? JSON.parse(localStorage.getItem('list_crack_games')) : []
    const [{list_crack_games}, action, loading] = React.useActionState(() => electronConnector.beProxy<{
        list_crack_games: crackedGameType[]
    }>({
        type: 'json',
        url: 'https://gamestatus.info/back/api/gameinfo/game/lastcrackedgames/'
    }), {list_crack_games: cache})

    list_crack_games.length = list_crack_games.length > 27 ? 27 : list_crack_games.length;
    const games: crackedGameType[] = list_crack_games

    React.useEffect(() => {
        React.startTransition(action)
        return () => {
            if (games) localStorage.setItem('list_crack_games', JSON.stringify(games))
        }
    }, [])

    const getImage = (g: crackedGameType) => {
        if (g.steam_prod_id) {
            return `https://cdn.steamstatic.com/steam/apps/${g.steam_prod_id}/header.jpg`
        }
        return g.short_image
    }

    const getFields = (currentGame: crackedGameType) => {
        return [{
            label: i18n.t('Name'),
            value: currentGame.title,
        }, {
            label: i18n.t('Is AAA'),
            value: currentGame.is_AAA ? i18n.t('Yes') : i18n.t('No')
        }, {
            label: i18n.t('Score'),
            value: currentGame.user_score
        }, {
            label: i18n.t('Store Link'),
            value: currentGame.steam_prod_id ?
                <div style={{cursor: 'pointer', display: 'inline'}} role="link" tabIndex={0} onClick={() => {
                    electronConnector.openLink(`https://store.steampowered.com/app/${currentGame.steam_prod_id}`)
                }}>{i18n.t('Steam Link')}</div> : null
        }, {
            label: i18n.t('Status'),
            value: currentGame.readable_status
        }, {
            label: i18n.t('Torrent (not recommended)'),
            value: currentGame.torrent_link ?
                <div style={{cursor: 'pointer', display: 'inline'}} role="link" tabIndex={0} onClick={() => {
                    electronConnector.openLink(currentGame.torrent_link)
                }}>{i18n.t('Link')}</div> : null
        }].filter(({value}) => value)
    }

    const renderDescription = (game) => {
        const fields = getFields(game)

        return (<ul>
            {fields.map((field) => (
                <li key={field.label}>
                    <strong>{field.label}:</strong><i>{field.value}</i>
                </li>
            ))}
        </ul>)
    }

    const renderTeaser = (game: crackedGameType) => {
        if (!game.teaser_link) return;
        const id = new URL(game.teaser_link).searchParams.get('v');
        return (
            <iframe
                loading="lazy"
                title={game.title}
                src={`https://www.youtube.com/embed/${id}?autoplay=1&loop=1&rel=0&mute=1&showinfo=0`}
            />
        )
    }

    const renderGame = (game: crackedGameType) => {
        const enabled = active === game.id
        return (
            <li key={game.id}
                tabIndex={1}
                role="button"
                className={enabled ? styles.active : ""}
                onBlur={() => {
                    setActive(0);
                }}
                onClick={() => {
                    setActive(game.id);
                }}>
                <img src={getImage(game)} alt={game.title} loading={"lazy"}
                     onError={(e) => {
                         if ((e.target as HTMLImageElement).src === game.short_image) return;
                         (e.target as HTMLImageElement).src = game.short_image
                     }}
                />
                {renderTeaser(game)}
                {renderDescription(game)}
            </li>
        )
    }

    const style: widgetWrapperStyleInterface = {
        '--lines': '3'
    }

    if (!games) return null;

    return (
        <React.Fragment>
            <h2>{i18n.t('Cracked Games')}</h2>
            <ul className={styles.freeWrapper} style={style}>
                {games.map(renderGame)}
                <Loader loading={loading}/>
            </ul>
        </React.Fragment>
    )

}

export default CrackedWidget