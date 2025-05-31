import {secondsToHms} from "../../hooks/usePlayTime";
import styles from './hltb.module.scss';

const RenderHLTB = ({game}) => {

    if (!game.igdb) return null

    return (
        <div className={styles.wrapper}>
            <span>
                <strong>Main: </strong>{secondsToHms(game.igdb.hltb.hastily * 1000)}
            </span>
            <span>
                <strong>Main + Sides: </strong>{secondsToHms(game.igdb.hltb.normally * 1000)}
            </span>
            <span>
                <strong>100%: </strong>{secondsToHms(game.igdb.hltb.completely * 10000)}
            </span>
        </div>
    )
}

export default RenderHLTB