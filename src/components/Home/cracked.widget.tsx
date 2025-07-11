import React from "react";

import electronConnector from "../../helpers/electronConnector";
import {crackedGameType} from "../../types/widget.types";
import Loader from "../Loader";

import styles from "./widgets.module.scss";

interface StyleInterface extends React.CSSProperties {
    '--lines': string
}

const CrackedWidget = () => {
    const [active, setActive] = React.useState(0);
    const [{games}, action, loading] = React.useActionState(electronConnector.crackWatchRequest, {games: []})
    React.useEffect(() => React.startTransition(action), [])

    const getImage = (g: crackedGameType) => {
        if (g.steam_prod_id) {
            return `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steam_prod_id}/header.jpg`
        }
        return g.short_image
    }

    const getFields = (currentGame: crackedGameType) => {
        return [{
            label: 'Name',
            value: currentGame.title,
        }, {
            label: 'Is AAA',
            value: currentGame.is_AAA ? 'Yes' : 'No'
        }, ...(currentGame.steam_prod_id ? [{
            label: 'Store Link',
            value: currentGame.steam_prod_id ?
                <div style={{cursor: 'pointer', display: 'inline'}} role="link" tabIndex={0} onClick={() => {
                    electronConnector.openLink(`https://store.steampowered.com/app/${currentGame.steam_prod_id}`)
                }}>Steam Link</div> : null
        }] : []), {
            label: 'Status',
            value: currentGame.readable_status
        }, {
            label: 'Hacked Groups',
            value: currentGame.hacked_groups
        }, ...(currentGame.torrent_link ? [{
            label: 'Torrent (not recommended)',
            value: currentGame.torrent_link ?
                <div style={{cursor: 'pointer', display: 'inline'}} role="link" tabIndex={0} onClick={() => {
                    electronConnector.openLink(currentGame.torrent_link)
                }}>Link</div> : null
        }] : []), {
            label: 'Cracked',
            value: new Date(currentGame.crack_date).toLocaleDateString()
        }]
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

    const style: StyleInterface = {
        '--lines': '3'
    }

    return (
        <React.Fragment>
            <h2>Cracked Games</h2>
            <ul className={styles.freeWrapper} style={style}>
                {games.map(renderGame)}
                <Loader loading={loading}/>
            </ul>
        </React.Fragment>
    )

}

export default CrackedWidget