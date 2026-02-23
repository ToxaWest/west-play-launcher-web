import React, {useEffect} from "react";
import useFooterActions from "@hook/useFooterActions";
import useTorrent from "@hook/useTorrent";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";

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

    const statusColors = {
        'Status_Down': 'text-[#4caf50]',
        'Status_Error': 'text-[#f44336]',
        'Status_Paused': 'text-[#ff9800]',
        'Status_Up': 'text-[#2196f3]'
    }

    return (
        <div className="p-gap h-full overflow-y-auto max-w-[90vw] mx-auto">
            <div className="flex gap-gap mb-gap">
                <button onClick={handleStartUtorrent} tabIndex={1} className="py-2 px-6 font-bold">{i18n.t('Open uTorrent')}</button>
                <button onClick={handleStopUtorrent} tabIndex={1} className="py-2 px-6 font-bold">{i18n.t('Close uTorrent')}</button>
            </div>
            
            <div className="flex flex-col gap-2">
                {torrents.map(torrent => (
                    <div 
                        key={torrent.hash} 
                        tabIndex={1}
                        role="button"
                        className={`glass p-theme rounded-theme flex items-center gap-gap transition-all focus-bloom cursor-default ${statusColors[torrent.status] || ''}`}
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate text-lg text-text">{torrent.name}</h3>
                            <div className="flex gap-4 text-sm opacity-70">
                                <span>{torrent.statusString}</span>
                                <span>{torrent.size}</span>
                                <span>{torrent.eta}</span>
                            </div>
                            <button 
                                type="button"
                                tabIndex={1}
                                className="text-xs opacity-50 truncate mt-1 hover:opacity-100 cursor-pointer bg-transparent border-none p-0 text-left w-full block"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    electronConnector.openLink(torrent.folder);
                                }}
                            >
                                {torrent.folder}
                            </button>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button tabIndex={1} className="p-2 min-w-[80px]" onClick={() => start(torrent.hash)}>{i18n.t('Start')}</button>
                            <button tabIndex={1} className="p-2 min-w-[80px]" onClick={() => stop(torrent.hash)}>{i18n.t('Pause')}</button>
                            <button tabIndex={1} className="p-2 min-w-[80px]" onClick={() => remove(torrent.hash)}>{i18n.t('Remove')}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Torrent;