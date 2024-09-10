import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import GamesList from "../GamesList";

const LastCracked = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        electronConnector.crackWatchRequest().then((g) => {
            setGames(g.games);
        })
    }, [])

    const getAppId = ({steam_prod_id, release_date, title}) => {
        return {
            fields: {
                name: title,
                release_date: {date: new Date(release_date).toLocaleDateString()}
            },
            appID: steam_prod_id ? {id: steam_prod_id, source: 'steam'} : null
        }
    }

    const renderInfoWrapper = ({is_AAA, crack_date}) => {
        const d = new Date().getTime()
        const c = new Date(crack_date).getTime()
        const diffTime = Math.abs(d - c);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return (
            <>
                <span>{`Cracked ${diffDays} day${diffDays === 1 ? '' : 's'} ago`}</span>
                {is_AAA ? <strong>AAA</strong> : null}
            </>
        )
    }

    const getFields = (currentGame) => {

        return [{
            label: 'Is AAA',
            value: currentGame.is_AAA ? 'Yes' : null
        }, {
            label: 'Is hot',
            value: currentGame.is_hot ? 'Yes' : null
        }, {
            label: 'Status',
            value: currentGame.readable_status
        }, {
            label: 'Hacked Groups',
            value: currentGame.hacked_groups
        }, {
            label: 'Protections',
            value: currentGame.protections
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

    return (
        <GamesList
            games={games}
            title={'Cracked Games'}
            getAppId={getAppId}
            renderInfoWrapper={renderInfoWrapper}
            getFields={getFields}
        />
    )
}

export default LastCracked