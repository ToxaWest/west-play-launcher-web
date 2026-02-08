import React from "react";
import { KinozalGame } from "@type/game.types";
import { useNavigate } from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
import Input from "../Input";
import Loader from "../Loader";

import styles from "./downloadGames.module.scss";

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
        <div className={styles.wrapper}>
            <h1>{i18n.t('Download Games')}</h1>
            <div style={{alignItems: 'flex-end', display: 'flex', gap: '10px'}}>
                <Input 
                    name="search" 
                    value={search} 
                    onChange={({value}) => setSearch(value as string)} 
                    label={i18n.t('Search')}
                />
                <button onClick={() => fetchGames(search)} tabIndex={1}>{i18n.t('Search')}</button>
            </div>
            
            {loading ? <Loader loading={true} /> : (
                <ul className={styles.list}>
                    {games.map(game => (
                        <li key={game.id} 
                            className={styles.item}
                            tabIndex={1}
                            role="button"
                            onClick={() => navigate(`/download-games/${game.id}`)}
                        >
                            <div className={styles.content}>
                                <div className={styles.title}>
                                    {game.rank !== 'normal' && <span className={`${styles.rank} ${styles[game.rank]}`} />}
                                    <span style={{color: getRankColor(game.rank)}}>{game.title}</span>
                                </div>
                                <div className={styles.info}>
                                    <span>{game.size}</span>
                                    <span style={{color: '#4caf50'}}>S: {game.seeds}</span>
                                    <span style={{color: '#f44336'}}>P: {game.peers}</span>
                                    <span>{game.date}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default DownloadGames;