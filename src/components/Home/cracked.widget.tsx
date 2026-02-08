import React from "react";
import type {crackedGameType, widgetWrapperStyleInterface} from "@type/widget.types";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

import styles from "./widgets.module.scss";

// Helper functions moved outside the main component as they don't depend on its state
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

const renderDescription = (game: crackedGameType) => {
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
    if (!game.teaser_link) return null;
    const id = new URL(game.teaser_link).searchParams.get('v');
    return (
        <iframe
            loading="lazy"
            title={game.title}
            src={`https://www.youtube.com/embed/${id}?autoplay=1&loop=1&rel=0&mute=1&showinfo=0`}
        />
    )
}

// New component for each list item to correctly use hooks
const CrackedGameItem = ({ game, isActive, onFocus, onBlur }: { game: crackedGameType, isActive: boolean, onFocus: () => void, onBlur: () => void }) => {
    const steamId = game.steam_prod_id;
    
    const imageSources = React.useMemo(() => {
        const steamImageSources = steamId ? [
            `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/header.jpg`,
            `https://shared.steamstatic.com/store_item_assets/steam/apps/${steamId}/header.jpg`,
            `https://cdn.steamstatic.com/steam/apps/${steamId}/header.jpg`,
        ] : [];
        return [...steamImageSources, game.short_image];
    }, [steamId, game.short_image]);

    const imageIndexRef = React.useRef(0);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        imageIndexRef.current += 1;
        const nextSrc = imageSources[imageIndexRef.current];
        if (nextSrc) {
            target.src = nextSrc;
        }
    };

    return (
        <li
            tabIndex={1}
            role="button"
            className={isActive ? styles.active : ""}
            onBlur={onBlur}
            onClick={onFocus}
        >
            <img 
                src={imageSources[0]} 
                alt={game.title} 
                loading={"lazy"}
                onError={handleImageError}
            />
            {renderTeaser(game)}
            {renderDescription(game)}
        </li>
    );
};

const CrackedWidget = () => {
    const [active, setActive] = React.useState<number | null>(null);
    const cache: crackedGameType[] = getFromStorage('list_crack_games');
    const [{list_crack_games}, action, loading] = React.useActionState(() => electronConnector.beProxy<{
        list_crack_games: crackedGameType[]
    }>({
        type: 'json',
        url: 'https://gamestatus.info/back/api/gameinfo/game/lastcrackedgames/'
    }), {list_crack_games: cache})

    const games: crackedGameType[] = list_crack_games ? list_crack_games.slice(0, 27) : [];

    React.useEffect(() => {
        React.startTransition(action)
        return () => {
            if (games.length > 0) setToStorage('list_crack_games', games)
        }
    }, [])

    const style: widgetWrapperStyleInterface = {
        '--lines': '3'
    }

    if (!games) return null;

    return (
        <React.Fragment>
            <h2>{i18n.t('Cracked Games')}</h2>
            <ul className={styles.freeWrapper} style={style}>
                {games.map(game => (
                    <CrackedGameItem
                        key={game.id}
                        game={game}
                        isActive={active === game.id}
                        onFocus={() => setActive(game.id)}
                        onBlur={() => setActive(null)}
                    />
                ))}
                <Loader loading={loading}/>
            </ul>
        </React.Fragment>
    )
}

export default CrackedWidget;