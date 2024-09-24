import electronConnector from "../../helpers/electronConnector";
import GamesList from "../GamesList";
import {useEffect, useRef, useState} from "react";
import useFooterActions from "../../hooks/useFooterActions";
import useWishList from "../../hooks/useWishList";

const CrackWatchList = ({games, title}) => {
    const [temp, setTemp] = useState(null);
    const tempRef = useRef(null)
    const {setFooterActions, removeFooterActions} = useFooterActions();
    const {update, inList, games: wGames} = useWishList();
    const wishListUpdate = () => {
        if (tempRef.current) {
            update(tempRef.current);
        }
    }

    useEffect(() => {
        if (temp) {
            setFooterActions({
                y: {
                    button: 'y',
                    title: (inList(temp) ? 'Remove from' : 'Add to') + ' Wishlist',
                    onClick: wishListUpdate
                }
            })
        } else {
            removeFooterActions(['y'])
        }
        tempRef.current = temp;
        return () => {
            removeFooterActions(['y'])
        }
    }, [temp, wGames])

    const getAppId = (props) => {
        setTemp(props);
        const {steam_prod_id, release_date, title} = props;
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
            title={title}
            getAppId={getAppId}
            renderInfoWrapper={renderInfoWrapper}
            getFields={getFields}
            getImage={(g) => {
                if (g.steam_prod_id) {
                    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steam_prod_id}/header.jpg?t=1671484934`
                }
                return g.short_image
            }}
            reset={() => {
                setTemp(null)
            }}
        />
    )
}

export default CrackWatchList