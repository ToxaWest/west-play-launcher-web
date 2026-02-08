import {useEffect, useState} from "react";
import {secondsToHms} from "@hook/usePlayTime";

import electronConnector from "../helpers/electronConnector";

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals))} ${['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'][i]}`
}

const CONST = {
    STATE_CHECKING: 2,
    STATE_ERROR: 16,
    STATE_PAUSED: 32,
    STATE_QUEUED: 64,
    STATE_STARTED: 1,
    TORRENT_DOWNSPEED: 9,
    TORRENT_ETA: 10,
    TORRENT_HASH: 0,
    TORRENT_NAME: 2,
    TORRENT_PROGRESS: 4,
    TORRENT_SAVE_PATH: 26,
    TORRENT_SIZE: 3,
    TORRENT_STATUS: 1,
    TORRENT_STATUS_MESSAGE: 21,
};

export interface TorrentItem {
    eta: string;
    folder: string;
    hash: string;
    name: string;
    progress: number;
    size: string;
    speed: string;
    status: string;
    statusString: string;
}

const useTorrent = ({ username = 'guest', password = '', port = 8080, url = 'http://127.0.0.1' } = {}) => {
    const [token, setToken] = useState<string | null>(null);
    const [torrents, setTorrents] = useState<TorrentItem[]>([]);
    const apiUrl = `${url}:${port}/gui/`;
    const options: RequestInit = {
        credentials: 'include',
        headers: {Authorization: 'Basic ' + btoa(username + ':' + password)}
    }

    const getToken = async () => {
        const html = await electronConnector.beProxy({
            options,
            type: 'text',
            url: apiUrl + 'token.html?t=' + Date.now()
        })
        if (!html) throw new Error('Error getting token');
        const doc = document.createElement('div');
        doc.innerHTML = html as string;
        return doc.querySelector('#token')?.textContent || '';
    }

    const getStatusInfo = (c: number, a: number) => {
        if (c & CONST.STATE_PAUSED) return "Status_Paused"
        if (c & CONST.STATE_STARTED) {
            return !(c & CONST.STATE_QUEUED) ? (a == 1000 ? "Status_Up" : "Status_Down") : (a == 1000 ? "Status_Up" : "Status_Down");
        }
        if (c & CONST.STATE_CHECKING) return "Status_Checking"
        if (c & CONST.STATE_ERROR) return "Status_Error"
        return (c & CONST.STATE_QUEUED) ? (a == 1000 ? "Status_Queued_Up" : "Status_Queued_Down") : (a == 1000 ? "Status_Completed" : "Status_Incomplete");
    }

    const getTorrents = (t: string) => {
        electronConnector.beProxy<{torrents: any[][]}>({
            options,
            type: 'json',
            url: apiUrl + `?token=${t}&list=1`
        }).then(r => {
            if (r && r.torrents) {
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
                })))
            }
            setTimeout(() => getTorrents(t), 1000)
        }).catch(() => {
             setTimeout(() => getTorrents(t), 5000)
        })
    }

    useEffect(() => {
        getToken().then(t => {
            setToken(t);
            getTorrents(t)
        }).catch(console.error)
    }, [])

    const performAction = async (action: string, hash?: string) => {
        let t = token;
        try {
            t = await getToken();
            setToken(t);
        } catch (error) {
            console.error(error);
            return;
        }

        await electronConnector.beProxy({
            options: { ...options, method: 'POST' },
            type: 'text',
            url: apiUrl + `?token=${t}&action=${action}` + (hash ? `&hash=${hash}` : '')
        });
        getTorrents(t);
    }

    return {
        getToken,
        refresh: () => token && getTorrents(token),
        remove: (hash: string) => performAction('remove', hash),
        start: (hash: string) => performAction('start', hash),
        stop: (hash: string) => performAction('stop', hash),
        torrents
    }
}

export default useTorrent;