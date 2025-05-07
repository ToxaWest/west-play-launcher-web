import {getFromStorage} from "../../helpers/getFromStorage";
import {startTransition, useActionState, useEffect, useState} from "react";
import useFooterActions from "../../hooks/useFooterActions";
import styles from './utorrent.module.scss';
import {secondsToHms} from "../../hooks/usePlayTime";

const torrentInterface = {
    TORRENT_HASH: 0,
    TORRENT_STATUS: 1,
    TORRENT_NAME: 2,
    TORRENT_SIZE: 3,
    TORRENT_PROGRESS: 4,
    TORRENT_DOWNLOADED: 5,
    TORRENT_UPLOADED: 6,
    TORRENT_RATIO: 7,
    TORRENT_UPSPEED: 8,
    TORRENT_DOWNSPEED: 9,
    TORRENT_ETA: 10,
    TORRENT_LABEL: 11,
    TORRENT_PEERS_CONNECTED: 12,
    TORRENT_PEERS_SWARM: 13,
    TORRENT_SEEDS_CONNECTED: 14,
    TORRENT_SEEDS_SWARM: 15,
    TORRENT_AVAILABILITY: 16,
    TORRENT_QUEUE_POSITION: 17,
    TORRENT_REMAINING: 18,
    TORRENT_DOWNLOAD_URL: 19,
    TORRENT_RSS_FEED_URL: 20,
    TORRENT_STATUS_MESSAGE: 21,
    TORRENT_STREAM_ID: 22,
    TORRENT_DATE_ADDED: 23,
    TORRENT_DATE_COMPLETED: 24,
    TORRENT_APP_UPDATE_URL: 25,
    TORRENT_SAVE_PATH: 26,
}

const Utorrent = props => {

    const {torrent_auth} = getFromStorage('config').settings;
    const [token, setToken] = useState(null);

    const {setFooterActions} = useFooterActions()
    useEffect(() => {
        setFooterActions({})
        if (torrent_auth) {
            fetch('http://127.0.0.1:19575/gui/token.html?localauth=' + torrent_auth).then(res => res.text()).then(innerHTML => {
                const tok = Object.assign(document.createElement('div'), {innerHTML}).querySelector('#token').innerHTML;
                setToken(tok)
            })
        }
    }, [])

    if (!torrent_auth) {
        return <div>Utorrent not configured</div>
    }

    const [data, fetchData] = useActionState(async () => {
        const res = await getData();
        setTimeout(() => {
            startTransition(fetchData)
        }, 1000)
        return res;
    }, [])

    const getData = async () => {
        const r = await fetch(`http://127.0.0.1:19575/gui/?token=${token}&localauth=${torrent_auth}&list=1&getmsg=1&cid=0`)
        const {torrents} = await r.json()
        return torrents
    }


    useEffect(() => {
        if (token) {
            startTransition(fetchData)
        }
    }, [token])


    function formatBytes(e, n) {
        const r = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
        if (0 === e) {
            const e = r[0];
            return "0 ".concat(e)
        }
        const i = Math.floor(Math.log(e) / Math.log(1024))
            , a = r[i];
        return "".concat(parseFloat(e / 1024 ** i).toFixed(n), " ").concat(a)
    }

    const renderTorrent = (item) => {
        const status = item[29][2];
        const percent = ((item[torrentInterface.TORRENT_DOWNLOADED] / item[torrentInterface.TORRENT_SIZE]) * 100).toFixed(2)
        const downloaded = formatBytes(item[torrentInterface.TORRENT_DOWNLOADED], 2) + ' / ' + formatBytes(item[torrentInterface.TORRENT_SIZE], 2);

        return (
            <li key={item[torrentInterface.TORRENT_HASH]}>
                <div>name: {item[torrentInterface.TORRENT_NAME]}</div>
                <div>seed: {item[torrentInterface.TORRENT_SEEDS_CONNECTED]}</div>
                <div>upload: {formatBytes(item[torrentInterface.TORRENT_UPSPEED], 2)}</div>
                <div>download: {formatBytes(item[torrentInterface.TORRENT_DOWNSPEED], 2)}</div>
                <div>status: {status}</div>
                <div>downloaded: {downloaded}</div>
                <div>Percent: {percent}%</div>
                <div>{secondsToHms(item[torrentInterface.TORRENT_ETA] * 1000)}</div>
            </li>
        )
    }


    return (
        <ul className={styles.wrapper}>
            {data.map(renderTorrent)}
        </ul>
    )
}

export default Utorrent