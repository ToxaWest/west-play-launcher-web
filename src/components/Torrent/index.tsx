import React, {useEffect} from "react";
import useFooterActions from "@hook/useFooterActions";
import useTorrent from "@hook/useTorrent";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";

import styles from './torrent.module.scss';

const Torrent = () => {
    const {torrents, start, stop, remove, refresh} = useTorrent({})
    const {setFooterActions} = useFooterActions()
    useEffect(() => {
        setFooterActions({})
    }, []);

    const handleStartUtorrent = async () => {
        await electronConnector.startUtorrent();
        setTimeout(refresh, 2000); // Wait for uTorrent to start
    };

    const handleStopUtorrent = async () => {
        await electronConnector.stopUtorrent();
        setTimeout(refresh, 1000); // Wait for uTorrent to stop
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.controls}>
                <button onClick={handleStartUtorrent} tabIndex={1}>{i18n.t('Open uTorrent')}</button>
                <button onClick={handleStopUtorrent} tabIndex={1}>{i18n.t('Close uTorrent')}</button>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Size</th>
                    <th>ETA</th>
                    <th>Folder</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {torrents.map(torrent => (
                    <tr key={torrent.hash} className={styles['status_' + torrent.status]}>
                        <td>{torrent.name}</td>
                        <td>{torrent.statusString}</td>
                        <td>{torrent.size}</td>
                        <td>{torrent.eta}</td>
                        <td
                            tabIndex={1}
                            role="button"
                            onClick={() => {
                                electronConnector.openLink(torrent.folder)
                            }}>{torrent.folder}</td>
                        <td className={styles.actions}>
                            <button tabIndex={1} onClick={() => start(torrent.hash)}>{i18n.t('Start')}</button>
                            <button tabIndex={1} onClick={() => stop(torrent.hash)}>{i18n.t('Pause')}</button>
                            <button tabIndex={1} onClick={() => remove(torrent.hash)}>{i18n.t('Remove')}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Torrent;