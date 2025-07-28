import React from "react";
import {secondsToHms} from "@hook/usePlayTime";
import type {Game} from "@type/game.types";

import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";

import styles from './hltb.module.scss';

const RenderHLTB = ({game}: { game: Game }) => {
    if (!game.hltb) return null
    const {allStylesTime, completionistTime, mainExtraTime, mainTime} = game.hltb
    const playTime = getFromStorage('playTime')[game.id] || 0

    const renderItem = (label: string, value?: number) => {
        if (!value) return null
        const percent = (playTime / (value * 1000)) * 100;
        const progress = percent > 100 ? 100 : percent;

        const style: React.CSSProperties & { '--progress': string, '--bgColor': string } = {
            '--bgColor': `rgba(0, 255, 0, ${progress / 100})`,
            '--progress': `${progress}%`
        }

        return (
            <span style={style}>
                {secondsToHms(value * 1000)}<strong>{label}</strong>
            </span>
        )
    }

    return (
        <div className={styles.wrapper}>
            {renderItem(i18n.t('Main Story'), mainTime)}
            {renderItem(i18n.t('Main + Sides'), mainExtraTime)}
            {renderItem(i18n.t('Completionist'), completionistTime)}
            {renderItem(i18n.t('All Styles'), allStylesTime)}
        </div>
    )
}

export default RenderHLTB