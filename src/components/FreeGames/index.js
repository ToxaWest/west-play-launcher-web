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
                .map(game => ({
                    ...game,
                    id: game.containerGameId,
                    short_image: game.image.split('_')[0] + '_616xr353.jpg',
                    name: game.title
                }))
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

    const renderSvg = ({platform}) => {
        if (!platform) {
            return null
        }
        const [, img] = platform.match(new RegExp(/"(.*)"/));
        const imgFullPath = 'https://gg.deals' + img;

        const [,platformName] = img.split('#')

        const width = {
            'svg-icon-platform-windows': 18,
            'svg-icon-platform-xbox-one': 46
        }
        return <svg height={18} width={width[platformName] || 18} style={{color: 'var(--theme-text-color)'}}>
            <use xlinkHref={imgFullPath} preserveAspectRatio="xMinYMid" />
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