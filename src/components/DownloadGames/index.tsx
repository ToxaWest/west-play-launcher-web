import React from "react";
import { KinozalGame } from "@type/game.types";
import { useNavigate } from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
import Input from "../Input";
import Loader from "../Loader";

const DownloadGames = () => {
    const [games, setGames] = React.useState<KinozalGame[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState('portable');
    const navigate = useNavigate();

    const fetchGames = async (query: string) => {
        setLoading(true);
        try {
            const res = await electronConnector.getKinozalGames(query);
            setGames(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        fetchGames(search);
    }, []);

    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'gold': return '#FFD700';
            case 'silver': return '#C0C0C0';
            default: return 'inherit';
        }
    }

    return (
        <div className="p-gap w-[90vw] mx-auto">
            <h1 className="text-[24px] font-bold mb-gap">{i18n.t('Download Games')}</h1>
            <div className="flex items-end gap-gap mb-gap">
                <Input 
                    name="search" 
                    value={search} 
                    onChange={({value}) => setSearch(value as string)} 
                    label={i18n.t('Search')}
                />
                <button onClick={() => fetchGames(search)} tabIndex={1} className="mb-0">{i18n.t('Search')}</button>
            </div>
            
            {loading ? <Loader loading={true} /> : (
                <div className="flex flex-col gap-2 pb-10">
                    {games.map(game => (
                        <div key={game.id} 
                            className="glass p-theme rounded-theme flex justify-between items-center transition-all cursor-pointer focus-bloom"
                            tabIndex={1}
                            role="button"
                            onClick={() => navigate(`/download-games/${game.id}`)}
                        >
                            <div className="flex items-center gap-gap-half text-[18px] min-w-0">
                                {game.rank !== 'normal' && <span className={`w-3 h-3 rounded-full shrink-0 ${game.rank === 'gold' ? 'bg-[#FFD700]' : 'bg-[#C0C0C0]'}`} />}
                                <span style={{color: getRankColor(game.rank)}} className="font-semibold truncate">{game.title}</span>
                            </div>
                            <div className="flex gap-gap items-center text-[14px] opacity-80 shrink-0">
                                <span>{game.size}</span>
                                <span className="text-earned">S: {game.seeds}</span>
                                <span className="text-[#f44336]">P: {game.peers}</span>
                                <span className="hidden sm:inline">{game.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DownloadGames;