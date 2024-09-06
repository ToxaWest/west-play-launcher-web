import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import RenderContent from "./renderContent";
import {secondsToHms} from "../../hooks/usePlayTime";
import styles from './game.module.scss'
const GameContent = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const lastPlayed = getFromStorage('lastPlayed')[game.id];
    const playTime = getFromStorage('playTime')[game.id];

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
                            <li key={label}><div><span>{secondsToHms(value * 1000)}</span></div><strong>{label}</strong></li>))}
                    </ul>
                    <div className={styles.score}>
                        <strong>Users score:</strong><span>{review_score}</span>
                    </div>
                </div>
            )
        }

        return null
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
    }]}>
        {renderHowLongToBeat()}
    </RenderContent>

}

export default GameContent