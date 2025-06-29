import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import RenderContent from "./renderContent";
import {secondsToHms} from "../../hooks/usePlayTime";
import electronConnector from "../../helpers/electronConnector";

const GameContent = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid == id);
    const ach = getFromStorage('achievements')[id]
    const playTime = getFromStorage('playTime')[game.id];
    const lastPlayed = getFromStorage('lastPlayed')[game.id];

    const sources = {
        'steam': 'Steam',
        'egs': 'Epic Games Store',
        'origin': 'Electronic Arts',
        'gog': 'GOG',
        'ryujinx': 'Nintendo Switch™'
    }

    const renderLink = (link) => {
        if (link) {
            return (<div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                electronConnector.openLink(link)
            }}>Link</div>)
        }
        return null
    }

    const checkVersion = (link) => {
        if (link) {
            return (<div style={{display: 'inline', cursor: 'pointer'}} onClick={(e) => {
                    electronConnector.CheckVersion(link).then(r => {
                        e.target.innerHTML = 'Version - ' + r;
                    })
                }}>Check</div>
            )
        }
        return null
    }

    const getAchCount = (a) => Object.values(a).filter(({earned}) => earned).length

    return <RenderContent game={game} fields={[{
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
        value: sources[game.source]
    }, {
        label: 'Store link',
        value: renderLink(game.storeUrl)
    }, {
        label: 'App id',
        value: game.source === 'steam' ? game.steamId : null
    }, {
        label: 'Licensed',
        value: !game.unofficial ? 'Yes' : 'No'
    }, {
        label: 'Download link',
        value: renderLink(game.downloadLink)
    }, {
        label: 'Check Version',
        value: checkVersion(game.downloadLink)
    }, {
        label: 'Version',
        value: game.buildVersion
    }]}/>

}

export default GameContent