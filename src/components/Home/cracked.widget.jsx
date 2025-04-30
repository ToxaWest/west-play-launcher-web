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
            return `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steam_prod_id}/header.jpg?t=1671484934`
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
        }, {
            label: 'Status',
            value: currentGame.readable_status
        }, {
            label: 'Hacked Groups',
            value: currentGame.hacked_groups
        }, {
            label: 'Torrent (not recommended)',
            value: currentGame.torrent_link ?
                <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                    electronConnector.openLink(currentGame.torrent_link)
                }}>Link</div> : null
        }, {
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
                <img src={getImage(game)} alt={game.title} loading={"lazy"}/>
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

export default CrackedWidget