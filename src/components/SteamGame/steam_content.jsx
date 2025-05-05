import {useParams} from "react-router-dom";
import RenderContent from "../Game/renderContent";
import {secondsToHms} from "../../hooks/usePlayTime";
import {startTransition, useActionState, useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import Loader from "../Loader";

const GameContent = () => {
    const {id} = useParams();
    const [playTime, setPlayTime] = useState(0);
    const [lastPlayed, setLastPlayed] = useState(0);

    const ach = null;
    const [game, fetchGame, loading] = useActionState(async () => await electronConnector.getGameByID({
        source: 'steam',
        id
    }), {})

    useEffect(() => {
        startTransition(fetchGame)
        electronConnector.getPlayTime({source: 'steam', id, unofficial: false}).then(d => {
            if (d) {
                setLastPlayed(d.lastPlayed)
                setPlayTime(d.playTime)
            }
        })
    }, [])

    const renderLink = (link) => {
        if (link) {
            return (<div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                electronConnector.openLink(link)
            }}>Link</div>)
        }
        return null
    }

    const getAchCount = (a) => Object.values(a).filter(({earned, progress}) => {
        if (!earned) {
            return false
        }
        if (progress) {
            return progress === 1
        }
        return true
    }).length

    return <>
        <Loader loading={loading}/>
        <RenderContent game={game} fields={[{
            label: 'Achievements',
            value: (game.achievements && ach) ? `${getAchCount(ach)} of ${Object.keys(game.achievements).length}` : null
        }, {
            label: 'Last played',
            value: lastPlayed ? new Date(lastPlayed).toLocaleDateString() : null
        }, {
            label: 'Play time',
            value: playTime ? secondsToHms(playTime) : null
        }, {
            label: 'Size',
            value: game.size
        }, {
            label: 'Store',
            value: 'Steam'
        }, {
            label: 'Store link',
            value: renderLink(game.storeUrl)
        }, {
            label: 'App id',
            value: (game.unofficial && game.source === 'steam') ? game.steamId : null
        }, {
            label: 'Licensed',
            value: !game.unofficial ? 'Yes' : 'No'
        }, {
            label: 'Download link',
            value: renderLink(game.downloadLink)
        }]}/></>

}

export default GameContent