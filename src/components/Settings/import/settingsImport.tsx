import React from "react";
import useNotification from "@hook/useNotification";
import type {Game} from "@type/game.types";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Loader from "../../Loader";
import SearchSteamGame from "../Games/searchSteamGame";

const SettingsImportSteam = () => {
    const [list, setList] = React.useState<Game[]>([]);
    const games = getFromStorage('games');
    const [loading, setLoading] = React.useState(false);
    const notifications = useNotification();
    const [active, setActive] = React.useState(false);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        electronConnector.getInstalledGames().then(setList)
    }, []);


    const renderActionButton = (item: Game) => {
        const installed = games.some(({id}) => id === item.id)

        return (
            <div className="flex items-center gap-2 mt-auto ml-auto">
                <button tabIndex={1} type="button" 
                    className="m-0 py-1 px-4 text-xs font-bold"
                    onClick={() => {
                    if (installed) {
                        const index = games.findIndex(({id}) => id === item.id);
                        if (index === -1) return;
                        games[index] = {...games[index], ...item};
                        setToStorage('games', games);
                        window.location.reload()
                        return;
                    }
                    setLoading(true);
                    if (item.source === 'egs' || item.source === 'ea') {
                        electronConnector.getSteamId(({searchParams}) => {
                            setSearch(searchParams)
                            setActive(true)
                            window.api.removeAllListeners('getSteamId')
                        })
                    }
                    electronConnector.getDataByGameId(item).then(r => {
                        setToStorage('games', [{...r, ...item}, ...games]);
                        notifications({
                            description: i18n.t('Configuration updated'),
                            img: '/assets/controller/save.svg',
                            name: i18n.t('Saved successfully'),
                            status: 'saving'
                        })
                        setLoading(false);
                        window.location.reload()
                    })
                }}>
                    {installed ? i18n.t('Update') : i18n.t('Install')}
                </button>
                {installed && <span className="w-2 h-2 rounded-full bg-earned shadow-[0_0_10px_var(--earned-color)]" title={i18n.t('Installed')}/>}
            </div>
        )
    }

    const renderImage = (item: Game) => {
        if (item.img_grid) return <img src={item.img_grid} alt={item.name} className="w-20 h-full object-cover rounded-l-theme shrink-0"/>
        const installed = games.find(({id}) => id === item.id)
        if (installed) return <img src={installed.img_grid} alt={item.name} className="w-20 h-full object-cover rounded-l-theme shrink-0"/>
        return <div className="w-20 bg-theme/20 rounded-l-theme flex items-center justify-center shrink-0"><span className="text-xs opacity-20 uppercase font-bold tracking-tighter">No Image</span></div>;
    }

    const renderItem = (item: Game) => (
        <li key={item.id} role="button" className="glass rounded-theme flex items-stretch min-w-0 transition-all focus-bloom" tabIndex={1}>
            {renderImage(item)}
            <div className="flex-1 gap-1 flex flex-col p-2 relative overflow-hidden min-w-0">
                <h2 className="text-sm font-bold truncate leading-tight mb-1">{item.name}</h2>
                <div className="flex items-center text-[10px] uppercase tracking-wider opacity-60">
                    <strong className="mr-1">{i18n.t('Source')}:</strong> 
                    <span className="truncate">{item.source}</span>
                </div>
                <div className="flex items-center text-[10px] uppercase tracking-wider opacity-60 cursor-pointer hover:opacity-100" role="button" tabIndex={1} onClick={() => {
                    electronConnector.openLink(item.path)
                }}>
                    <strong className="mr-1">{i18n.t('Folder')}:</strong>
                    <span className="truncate">{item.path}</span>
                </div>
                {renderActionButton(item)}
            </div>
        </li>
    )

    return (
        <div className="pb-10">
            <h1 className="text-2xl font-bold mb-gap px-2">{i18n.t('Import Games')}</h1>
            <ul className="grid relative gap-2 max-w-full w-full grid-cols-2 list-none p-0 m-0">
                <Loader loading={loading}/>
                {list.sort((a, b) => a.name.localeCompare(b.name)).map(renderItem)}
            </ul>
            <SearchSteamGame defaultValue={search} active={active} setActive={setActive}/>
        </div>
    )
}

export default SettingsImportSteam;