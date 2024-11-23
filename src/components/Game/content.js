import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import RenderContent from "./renderContent";
import {secondsToHms} from "../../hooks/usePlayTime";
import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";

const GameContent = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const [playTime, setPlayTime] = useState(0);
    const [lastPlayed, setLastPlayed] = useState(0);

    useEffect(() => {
        setPlayTime(getFromStorage('playTime')[game.id]);
        setLastPlayed(getFromStorage('lastPlayed')[game.id]);
        electronConnector.getPlayTime({source: game.source, id: game.nspId || game.psId}).then(d => {
            if (d) {
                setLastPlayed(d.lastPlayed)
                setPlayTime(d.playTime)
            }
        })
    }, [])

    const sources = {
        'steam': 'Steam',
        'egs': 'Epic Games Store',
        'origin': 'Electronic Arts',
        'gog': 'GOG',
        'ryujinx': 'Nintendo Switch™',
        'rpcs3': 'PlayStation™ Store'
    }

    return <RenderContent game={game} fields={[{
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
        value: sources[game.source]
    }, {
        label: 'Licensed',
        value: !game.unofficial ? 'Yes' : 'No'
    }]}>
    </RenderContent>

}

export default GameContent