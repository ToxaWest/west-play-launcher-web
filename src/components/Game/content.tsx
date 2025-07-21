import React from "react";
import {secondsToHms} from "@hook/usePlayTime";
import type {EarnedAchievementsType} from "@type/game.types";
import {useParams} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";

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

    const renderLink = (link?: string, title?: string | number) => {
        if (link) {
            return (<div style={{cursor: 'pointer', display: 'inline'}} role="link" tabIndex={0} onClick={() => {
                electronConnector.openLink(link)
            }}>{title}</div>)
        }
        return null
    }

    const checkVersion = (link?: string) => {
        if (link) {
            return (<div style={{cursor: 'pointer', display: 'inline'}} role="button" tabIndex={1} onClick={(e) => {
                    electronConnector.CheckVersion(link).then(r => {
                        if (r.trim().toLowerCase() === game.buildVersion.trim().toLowerCase()) {
                            (e.target as HTMLDivElement).innerHTML = `${r} - ${i18n.t('Version up to date')}`;
                            return;
                        }
                        (e.target as HTMLDivElement).innerHTML = `${i18n.t('New version')} - ${r}, ${i18n.t('Current version')} - ${game.buildVersion}`;
                    })
                }}>{game.buildVersion}</div>
            )
        }
        return null
    }

    const getAchCount = (a: EarnedAchievementsType) => Object.values(a).filter(({earned}) => earned).length

    return <RenderContent game={game} fields={[{
        label: i18n.t('Achievements'),
        value: (game.achievements && ach) ? `${getAchCount(ach)} of ${Object.keys(game.achievements).length}` : null
    }, {
        label: i18n.t('Last played'),
        value: lastPlayed ? new Date(lastPlayed).toLocaleDateString() : null
    }, {
        label: i18n.t('Play time'),
        value: playTime ? secondsToHms(playTime) : null
    }, {
        label: i18n.t('Size'),
        value: game.size
    }, {
        label: i18n.t('Store'),
        value: renderLink(game.storeUrl, sources[game.source])
    }, {
        label: i18n.t('App id'),
        value: renderLink(game.path, game.id),
    }, {
        label: i18n.t('Licensed'),
        value: !game.unofficial ? i18n.t('Yes') : i18n.t('No')
    }, {
        label: i18n.t('Download link'),
        value: renderLink(game.downloadLink, i18n.t('Download'))
    }, {
        label: i18n.t('Version'),
        value: checkVersion(game.downloadLink)
    }]}/>

}

export default GameContent