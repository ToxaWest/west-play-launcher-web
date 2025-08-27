import {useEffect, useState} from "react";
import {secondsToHms} from "@hook/usePlayTime";

import electronConnector from "../helpers/electronConnector";

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const CONST = {
    BUILD: "2013-05-28",
    FILEPRIORITY_HIGH: 3,
    FILEPRIORITY_LOW: 1,
    FILEPRIORITY_NORMAL: 2,
    FILEPRIORITY_SKIP: 0,
    FILE_DOWNLOADED: 2,
    FILE_DURATION: 8,
    FILE_ENCODED_RATE: 7,
    FILE_FIRST_PIECE: 4,
    FILE_HEIGHT: 10,
    FILE_NAME: 0,
    FILE_NUM_PIECES: 5,
    FILE_PRIORITY: 3,
    FILE_SIZE: 1,
    FILE_STREAMABILITY: 12,
    FILE_STREAMABLE: 6,
    FILE_STREAM_ETA: 11,
    FILE_WIDTH: 9,
    PEER_CLIENT: 5,
    PEER_COUNTRY: 0,
    PEER_DOWNLOADED: 14,
    PEER_DOWNSPEED: 8,
    PEER_FLAGS: 6,
    PEER_HASHERR: 15,
    PEER_INACTIVE: 20,
    PEER_IP: 1,
    PEER_MAXDOWN: 18,
    PEER_MAXUP: 17,
    PEER_PEERDL: 16,
    PEER_PORT: 4,
    PEER_PROGRESS: 7,
    PEER_QUEUED: 19,
    PEER_RELEVANCE: 21,
    PEER_REQS_IN: 11,
    PEER_REQS_OUT: 10,
    PEER_REVDNS: 2,
    PEER_UPLOADED: 13,
    PEER_UPSPEED: 9,
    PEER_UTP: 3,
    PEER_WAITED: 12,
    RSSFEED_DOWNLOAD_STATE: 5,
    RSSFEED_ENABLED: 1,
    RSSFEED_ID: 0,
    RSSFEED_ITEMS: 8,
    RSSFEED_NEXT_UPDATE: 7,
    RSSFEED_PROGRAMMED: 4,
    RSSFEED_URL: 6,
    RSSFEED_USER_SELECTED: 3,
    RSSFEED_USE_FEED_TITLE: 2,
    RSSFILTERFLAG_ADD_STOPPED: 16,
    RSSFILTERFLAG_ENABLE: 1,
    RSSFILTERFLAG_HIGH_PRIORITY: 4,
    RSSFILTERFLAG_ORIG_NAME: 2,
    RSSFILTERFLAG_SMART_EP_FILTER: 8,
    RSSFILTER_DIRECTORY: 5,
    RSSFILTER_EPISODE_FILTER: 14,
    RSSFILTER_EPISODE_FILTER_STR: 13,
    RSSFILTER_FEED: 6,
    RSSFILTER_FILTER: 3,
    RSSFILTER_FLAGS: 1,
    RSSFILTER_ID: 0,
    RSSFILTER_LABEL: 8,
    RSSFILTER_LAST_MATCH: 10,
    RSSFILTER_NAME: 2,
    RSSFILTER_NOT_FILTER: 4,
    RSSFILTER_POSTPONE_MODE: 9,
    RSSFILTER_QUALITY: 7,
    RSSFILTER_REPACK_EP_FILTER: 12,
    RSSFILTER_RESOLVING_CANDIDATE: 15,
    RSSFILTER_SMART_EP_FILTER: 11,
    RSSITEMCODECMAP: ["?", "MPEG", "MPEG-2", "MPEG-4", "Real", "WMV", "Xvid", "DivX", "X264", "H264", "WMV-HD", "VC1"],
    RSSITEMCODEC_DIVX: 7,
    RSSITEMCODEC_H264: 9,
    RSSITEMCODEC_MPEG: 1,
    RSSITEMCODEC_MPEG2: 2,
    RSSITEMCODEC_MPEG4: 3,
    RSSITEMCODEC_NONE: 0,
    RSSITEMCODEC_REAL: 4,
    RSSITEMCODEC_VC1: 11,
    RSSITEMCODEC_WMV: 5,
    RSSITEMCODEC_WMVHD: 10,
    RSSITEMCODEC_X264: 8,
    RSSITEMCODEC_XVID: 6,
    RSSITEMQUALITYMAP: ["?", "HDTV", "TVRip", "DVDRip", "SVCD", "DSRip", "DVBRip", "PDTV", "HR.HDTV", "HR.PDTV", "DVDR", "DVDScr", "720p", "1080i", "1080p", "WebRip", "SatRip"],
    RSSITEMQUALITY_1080I: 4096,
    RSSITEMQUALITY_1080P: 8192,
    RSSITEMQUALITY_720P: 2048,
    RSSITEMQUALITY_ALL: -1,
    RSSITEMQUALITY_DSRIP: 16,
    RSSITEMQUALITY_DVBRIP: 32,
    RSSITEMQUALITY_DVDR: 512,
    RSSITEMQUALITY_DVDRIP: 4,
    RSSITEMQUALITY_DVDSCR: 1024,
    RSSITEMQUALITY_HDTV: 1,
    RSSITEMQUALITY_HRHDTV: 128,
    RSSITEMQUALITY_HRPDTV: 256,
    RSSITEMQUALITY_NONE: 0,
    RSSITEMQUALITY_PDTV: 64,
    RSSITEMQUALITY_SATRIP: 32768,
    RSSITEMQUALITY_SVCD: 8,
    RSSITEMQUALITY_TVRIP: 2,
    RSSITEMQUALITY_WEBRIP: 16384,
    RSSITEM_CODEC: 4,
    RSSITEM_EPISODE: 7,
    RSSITEM_EPISODE_TO: 8,
    RSSITEM_FEED_ID: 9,
    RSSITEM_IN_HISTORY: 11,
    RSSITEM_NAME: 0,
    RSSITEM_NAME_FULL: 1,
    RSSITEM_QUALITY: 3,
    RSSITEM_REPACK: 10,
    RSSITEM_SEASON: 6,
    RSSITEM_TIMESTAMP: 5,
    RSSITEM_URL: 2,
    SETTINGPARAM_ACCESS_RO: "R",
    SETTINGPARAM_ACCESS_RW: "Y",
    SETTINGPARAM_ACCESS_WO: "W",
    SETTINGTYPE_BOOLEAN: 1,
    SETTINGTYPE_INTEGER: 0,
    SETTINGTYPE_STRING: 2,
    SETTING_NAME: 0,
    SETTING_PARAMS: 3,
    SETTING_TYPE: 1,
    SETTING_VALUE: 2,
    STATE_CHECKING: 2,
    STATE_ERROR: 16,
    STATE_PAUSED: 32,
    STATE_QUEUED: 64,
    STATE_STARTED: 1,
    TORRENT_APP_UPDATE_URL: 25,
    TORRENT_AVAILABILITY: 16,
    TORRENT_DATE_ADDED: 23,
    TORRENT_DATE_COMPLETED: 24,
    TORRENT_DOWNLOADED: 5,
    TORRENT_DOWNLOAD_URL: 19,
    TORRENT_DOWNSPEED: 9,
    TORRENT_ETA: 10,
    TORRENT_HASH: 0,
    TORRENT_LABEL: 11,
    TORRENT_NAME: 2,
    TORRENT_PEERS_CONNECTED: 12,
    TORRENT_PEERS_SWARM: 13,
    TORRENT_PROGRESS: 4,
    TORRENT_QUEUE_POSITION: 17,
    TORRENT_RATIO: 7,
    TORRENT_REMAINING: 18,
    TORRENT_RSS_FEED_URL: 20,
    TORRENT_SAVE_PATH: 26,
    TORRENT_SEEDS_CONNECTED: 14,
    TORRENT_SEEDS_SWARM: 15,
    TORRENT_SIZE: 3,
    TORRENT_STATUS: 1,
    TORRENT_STATUS_MESSAGE: 21,
    TORRENT_STREAM_ID: 22,
    TORRENT_UPLOADED: 6,
    TORRENT_UPSPEED: 8,
    TOR_DBLCLK_OPEN_FOLDER: 2,
    TOR_DBLCLK_SHOW_DL_BAR: 3,
    TOR_DBLCLK_SHOW_PROPS: 0,
    TOR_DBLCLK_START_STOP: 1,
    TOR_REMOVE: 0,
    TOR_REMOVE_DATA: 2,
    TOR_REMOVE_DATATORRENT: 3,
    TOR_REMOVE_TORRENT: 1,
    TRANSDISP_IN_TCP: 4,
    TRANSDISP_IN_UTP: 8,
    TRANSDISP_OUT_TCP: 1,
    TRANSDISP_OUT_UTP: 2,
    TRANSDISP_UTP: (2 | 8),
    TRANSDISP_UTP_NEW_HEADER: 16,
    VERSION: "0.388"
};


const useTorrent = ({
                        username = 'guest',
                        password = '',
                        port = 8080,
                        url = 'http://127.0.0.1'
                    }: {
    username?: string;
    password?: string;
    port?: number;
    url?: string;
}) => {
    const [token, setToken] = useState<string | null>(null);
    const [torrents, setTorrents] = useState<any[]>([]);
    const apiUrl = `${url}:${port}/gui/`;
    const options: RequestInit = {
        credentials: 'include',
        headers: {Authorization: 'Basic ' + btoa(username + ':' + password)}
    }

    const getToken = async () => {
        const html = await electronConnector.beProxy({
            options,
            type: 'text',
            url: apiUrl + 'token.html?t=' + new Date().getTime()
        })

        if (!html) throw new Error('Error getting token');
        const doc = document.createElement('div');
        doc.innerHTML = html as string;
        return doc.querySelector('#token').textContent;
    }

    useEffect(() => {
        getToken().then(t => {
            setToken(t);
            getTorrents(t)
        })
    }, [])

    const getStatusInfo = (c: number, a: number) => {
        if (c & CONST.STATE_PAUSED) return "Status_Paused"
        else {
            if (c & CONST.STATE_STARTED) {
                if (!(c & CONST.STATE_QUEUED)) return "Force_" + (a == 1000) ? "Status_Up" : "Status_Down"
                return (a == 1000) ? "Status_Up" : "Status_Down";
            } else {
                if (c & CONST.STATE_CHECKING) return "Status_Checking"
                else {
                    if (c & CONST.STATE_ERROR) return "Status_Error"
                    else {
                        if (c & CONST.STATE_QUEUED) return (a == 1000) ? "Status_Queued_Up" : "Status_Queued_Down"
                        return (a == 1000) ? "Status_Completed" : "Status_Incomplete";
                    }
                }
            }
        }
    }

    const
        getTorrents = (token: string) => {
            electronConnector.beProxy<{torrents: {}[]}>({
                options,
                type: 'json',
                url: apiUrl + `?token=${token}&list=1`
            }).then(r => {
                setTorrents(r.torrents.map(torrent => ({
                        eta: secondsToHms(torrent[CONST.TORRENT_ETA] * 1000),
                        folder: torrent[CONST.TORRENT_SAVE_PATH],
                        hash: torrent[CONST.TORRENT_HASH],
                        name: torrent[CONST.TORRENT_NAME],
                        progress: torrent[CONST.TORRENT_PROGRESS] / 10,
                        size: formatBytes(torrent[CONST.TORRENT_SIZE]),
                        speed: formatBytes(torrent[CONST.TORRENT_DOWNSPEED]) + '/s',
                        status: getStatusInfo(torrent[CONST.TORRENT_STATUS], torrent[CONST.TORRENT_PROGRESS]),
                        statusString: torrent[CONST.TORRENT_STATUS_MESSAGE],
                    })
                ))
                setTimeout(() => {
                    getTorrents(token)
                }, 1000)
            })
        }

    return {
        getToken,
        torrents
    }
}

export default useTorrent;