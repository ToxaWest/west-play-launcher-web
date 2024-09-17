import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import RenderContent from "./renderContent";
import {secondsToHms} from "../../hooks/usePlayTime";
import styles from './game.module.scss'
import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";

const GameContent = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const [playTime, setPlayTime] = useState(0);
    const [lastPlayed, setLastPlayed] = useState(0);

    useEffect(() => {
        setPlayTime(getFromStorage('playTime')[game.id]);
        setLastPlayed(getFromStorage('lastPlayed')[game.id]);
        electronConnector.getPlayTime({source: game.source, id: game.nspId || game.psId}).then(d => {
            if (d) {
                setLastPlayed(d.lastPlayed)
                setPlayTime(d.playTime)
            }
        })
    }, [])


    const renderHowLongToBeat = () => {
        if (game.howLongToBeat) {
            const {comp_100, comp_all, comp_plus, comp_main, review_score} = game.howLongToBeat
            const list = [{
                label: 'Main Story',
                value: comp_main,
            }, {
                label: 'Main + Sides',
                value: comp_plus,
            }, {
                label: 'Completionist',
                value: comp_100,
            }, {
                label: 'All Styles',
                value: comp_all,
            }]

            return (
                <div className={styles.hltb}>
                    <ul>
                        {list.map(({label, value}) => (
                            <li key={label}>
                                <div><span>{secondsToHms(value * 1000)}</span></div>
                                <strong>{label}</strong></li>))}
                    </ul>
                    <div className={styles.score}>
                        <strong>Users score:</strong><span>{review_score}</span>
                    </div>
                </div>
            )
        }

        return null
    }

    const sources = {
        'steam': 'Steam',
        'egs': 'Epic Games Store',
        'origin': 'Electronic Arts',
        'gog': 'GOG',
        'ryujinx': 'Nintendo Switch™',
        'rpcs3': 'PlayStation™ Store'
    }

    return <RenderContent game={game} fields={[{
        label: 'Last played',
        value: lastPlayed ? new Date(lastPlayed).toLocaleDateString() : null
    }, {
        label: 'Play time',
        value: playTime ? secondsToHms(playTime) : null
    }, {
        label: 'Size',
        value: game.size
    }, {
        label: 'Store',
        value: sources[game.source]
    }, {
        label: 'Licensed',
        value: !game.unofficial ? 'Yes' : 'No'
    }]}>
        {renderHowLongToBeat()}
    </RenderContent>

}

export default GameContent