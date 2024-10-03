import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import GamesList from "../GamesList";

const disabledPlatforms = ["xbox-one", "ps-4"]

const FreeGames = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        electronConnector.getFreeGames().then((elements) => {
            const result = elements.filter(game => !disabledPlatforms.includes(game.platformName))
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

        if(shopId === '10'){
            const gogGames = await electronConnector.gameSearch({query, source: 'gog'})
            const current = gogGames.find(({productType}) => productType === "game") || gogGames[0];
            if (current) {
                return {appID: {id: current.appid, source: 'gog'}, fields: {}}
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

    const renderSvg = ({platformSvg}) => {
        return <svg height={18} width={18} style={{color: 'var(--theme-text-color)'}}>
            <use xlinkHref={platformSvg} preserveAspectRatio="xMinYMid"/>
        </svg>
    }

    const getFields = (currentGame) => {
        return [{
            label: 'Platform',
            value: renderSvg(currentGame)
        }, {
            label: 'Store',
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