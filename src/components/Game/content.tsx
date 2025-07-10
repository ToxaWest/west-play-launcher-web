import React from "react";
import {useParams} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import {secondsToHms} from "../../hooks/usePlayTime";
import type {EarnedAchievementsType} from "../../types/game.types";

import RenderContent from "./renderContent";

const GameContent = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const ach = getFromStorage('achievements')[id]
    const playTime = getFromStorage('playTime')[game.id];
    const lastPlayed = getFromStorage('lastPlayed')[game.id];

    const sources = {
        'egs': 'Epic Games Store',
        'gog': 'GOG',
        'origin': 'Electronic Arts',
        'ryujinx': 'Nintendo Switch™',
        'steam': 'Steam'
    }

    const renderLink = (link?: string) => {
        if (link) {
            return (<div style={{cursor: 'pointer', display: 'inline'}} role="link" tabIndex={0} onClick={() => {
                electronConnector.openLink(link)
            }}>Link</div>)
        }
        return null
    }

    const checkVersion = (link?: string) => {
        if (link) {
            return (<div style={{cursor: 'pointer', display: 'inline'}} role="button" tabIndex={1} onClick={(e) => {
                    electronConnector.CheckVersion(link).then(r => {
                        (e.target as HTMLDivElement).innerHTML = 'Version - ' + r;
                    })
                }}>Check</div>
            )
        }
        return null
    }

    const getAchCount = (a: EarnedAchievementsType) => Object.values(a).filter(({earned}) => earned).length

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