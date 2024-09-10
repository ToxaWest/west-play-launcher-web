import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import GamesList from "../GamesList";

const disabledStores = ["109"]

const FreeGames = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        electronConnector.getFreeGames().then((elements) => {
            const result = elements
                .filter(game => !disabledStores.includes(game.shopId))
            setGames(result)
        })
    }, []);

    const getAppId = async (props) => {
        const {name: query, shopId} = props;
        if (shopId === '57') {
            const epicData = await electronConnector.gameSearch({query, source: 'egs'})
            const current = epicData.find(({productType}) => productType === "BASE_GAME")
            if (current) {
                return {appID: {id: {sandboxId: current.namespace}, source: 'egs'}, fields: {}}
            }
        }

        if (shopId === '4') {
            const [steamSearch] = await electronConnector.gameSearch({query, source: 'steam'})
            if (steamSearch) {
                return {appID: {id: steamSearch.appid, source: 'steam'}, fields: {}}
            }
        }
        return {appID: null, fields: {name: query}}
    }

    const renderTime = ({endTime, startTime}) => {
        const dateFormatter = (t) => new Date(parseInt(t) * 1000).toLocaleDateString()
        if (endTime) {
            return `${dateFormatter(startTime)} - ${dateFormatter(endTime)}`
        }

        return `From ${dateFormatter(startTime)}`
    }

    const renderSvg = ({platformName, platformSvg}) => {
        const width = {'windows': 18, 'xbox-one': 46}
        return <svg height={18} width={width[platformName] || 18} style={{color: 'var(--theme-text-color)'}}>
            <use xlinkHref={platformSvg} preserveAspectRatio="xMinYMid"/>
        </svg>
    }

    const getFields = (currentGame) => {
        return [{
            label: 'Platform',
            value: renderSvg(currentGame)
        }, {
            label: 'Shop',
            value: currentGame.shopName
        }, {
            label: 'Free period',
            value: renderTime(currentGame)
        }, {
            label: 'Store Link',
            value: currentGame.link ?
                <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                    electronConnector.openLink(currentGame.link)
                }}>Link</div> : null
        }]
    }

    return (
        <GamesList
            games={games}
            title={`Free Games (${games.length})`}
            getAppId={getAppId}
            getFields={getFields}
        />
    )
}

export default FreeGames;