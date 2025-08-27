import React, {useEffect} from "react";
import useFooterActions from "@hook/useFooterActions";
import useTorrent from "@hook/useTorrent";

import electronConnector from "../../helpers/electronConnector";

import styles from './torrent.module.scss';

const Torrent = () => {
    const {torrents} = useTorrent({})
    const {setFooterActions} = useFooterActions()
    useEffect(() => {
        setFooterActions({})
    }, []);

    return (
        <div className={styles.wrapper}>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Size</th>
                    <th>ETA</th>
                    <th>Folder</th>
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
                            tabIndex={0}
                            role="button"
                            onClick={() => {
                                electronConnector.openLink(torrent.folder)
                            }}>{torrent.folder}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Torrent;