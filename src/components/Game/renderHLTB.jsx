import {secondsToHms} from "../../hooks/usePlayTime";
import styles from './hltb.module.scss';

const RenderHLTB = ({game}) => {

    if (!game.hltb) return null

    const {allStylesTime, completionistTime, mainExtraTime, mainTime} = game.hltb

    const renderItem = (label, value) => {
        if(!value) return null
        return (
            <span>
                <strong>{label}</strong>{secondsToHms(value * 1000)}
            </span>
        )
    }

    return (
        <div className={styles.wrapper}>
            {renderItem('Main', mainTime)}
            {renderItem('Main + Sides', mainExtraTime)}
            {renderItem('100%', completionistTime)}
            {renderItem('All Styles', allStylesTime)}
        </div>
    )
}

export default RenderHLTB