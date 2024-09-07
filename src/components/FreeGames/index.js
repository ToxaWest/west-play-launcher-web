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

    const getAppId = async ({title: params}) => {
        const data = await electronConnector.steamSearch({params})
        if (data.length === 1) {
            return {appID: data[0].appid, fields: {}}
        }
        return {
            appID: data.find(({name}) => name === params)?.appid,
            fields: {}
        };
    }

    const renderTime = ({endTime, startTime}) => {
        const dateFormatter = (t) => new Date(parseInt(t) * 1000).toLocaleDateString()
        if (endTime) {
            return (
                <>
                    {dateFormatter(startTime)} - {dateFormatter(endTime)}
                </>
            )
        }

        return <>From {dateFormatter(startTime)}</>
    }

    const renderSvg = ({platformName, platformSvg}) => {
        const width = {
            'windows': 18,
            'xbox-one': 46
        }
        return <svg height={18} width={width[platformName] || 18} style={{color: 'var(--theme-text-color)'}}>
            <use xlinkHref={platformSvg} preserveAspectRatio="xMinYMid" />
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