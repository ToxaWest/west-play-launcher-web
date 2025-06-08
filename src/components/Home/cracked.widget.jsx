import {startTransition, useActionState, useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from "./widgets.module.scss";
import Loader from "../Loader";

const CrackedWidget = () => {
    const [active, setActive] = useState(0);
    const [{games}, action, loading] = useActionState(electronConnector.crackWatchRequest, {games: []})
    useEffect(() => startTransition(action), [])

    const getImage = (g) => {
        if (g.steam_prod_id) {
            return `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steam_prod_id}/header.jpg`
        }
        return g.short_image
    }

    const getFields = (currentGame) => {
        return [{
            label: 'Name',
            value: currentGame.title,
        }, {
            label: 'Is AAA',
            value: currentGame.is_AAA ? 'Yes' : 'No'
        }, ...(currentGame.steam_prod_id  ? [{
            label: 'Store Link',
            value: currentGame.steam_prod_id ?
                <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                    electronConnector.openLink(`https://store.steampowered.com/app/${currentGame.steam_prod_id}`)
                }}>Steam Link</div> : null
        }] : []) , {
            label: 'Status',
            value: currentGame.readable_status
        }, {
            label: 'Hacked Groups',
            value: currentGame.hacked_groups
        }, ...(currentGame.torrent_link  ? [{
            label: 'Torrent (not recommended)',
            value: currentGame.torrent_link ?
                <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                    electronConnector.openLink(currentGame.torrent_link)
                }}>Link</div> : null
        }] : []) , {
            label: 'Cracked',
            value: new Date(currentGame.crack_date).toLocaleDateString()
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

    const renderTeaser = (game) => {
        if (!game.teaser_link) return;
        const id = new URL(game.teaser_link).searchParams.get('v');
        return (
            <iframe
                loading="lazy"
                src={`https://www.youtube.com/embed/${id}?autoplay=1&loop=1&rel=0&mute=1&showinfo=0`}
                frameBorder="0"/>
        )
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
                onClick={() => {
                    setActive(game.id);
                }}>
                <img src={getImage(game)} alt={game.title} loading={"lazy"}
                     onError={(e) => {
                         if (e.target.src === game.short_image) return;
                         e.target.src = game.short_image
                     }}
                />
                {renderTeaser(game)}
                {renderDescription(game)}
            </li>
        )
    }

    return (
        <ul className={styles.freeWrapper} style={{'--lines': '3'}}>
            {games.map(renderGame)}
            <Loader loading={loading}/>
        </ul>
    )

}

export default CrackedWidget