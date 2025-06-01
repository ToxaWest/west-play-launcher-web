import {secondsToHms} from "../../hooks/usePlayTime";
import styles from './hltb.module.scss';

const RenderHLTB = ({game}) => {

    if (!game?.igdb?.hltb) return null

    const {hastily, normally, completely} = game.igdb.hltb

    const renderItem = (label, value) => {
        if(!value) return null
        return (
            <span>
                <strong>{label}: </strong>{secondsToHms(value * 1000)}
            </span>
        )
    }

    return (
        <div className={styles.wrapper}>
            {renderItem('Main', hastily)}
            {renderItem('Main + Sides', normally)}
            {renderItem('100%', completely)}
        </div>
    )
}

export default RenderHLTB