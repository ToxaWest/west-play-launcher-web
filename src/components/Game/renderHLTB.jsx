import {secondsToHms} from "../../hooks/usePlayTime";
import styles from './hltb.module.scss';

const RenderHLTB = ({game}) => {

    if (!game.hltb) return null

    const {allStylesTime, completionistTime, mainExtraTime, mainTime} = game.hltb

    const renderItem = (label, value) => {
        if(!value) return null
        return (
            <span>
                {secondsToHms(value * 1000)}<strong>{label}</strong>
            </span>
        )
    }

    return (
        <div className={styles.wrapper}>
            {renderItem('Main Story', mainTime)}
            {renderItem('Main + Sides', mainExtraTime)}
            {renderItem('Completionist', completionistTime)}
            {renderItem('All Styles', allStylesTime)}
        </div>
    )
}

export default RenderHLTB