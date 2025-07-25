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

        const getColor = () => {
            if (progress >= 90) return '#009e00'
            if (progress >= 70) return '#008200'
            if (progress >= 50) return '#006600'
            if (progress >= 30) return '#004a00'
            if (progress >= 10) return '#002e00'
            return '#000000'
        }

        const getStyle = (progress: number, color: string): React.CSSProperties & {
            '--progress': string,
            '--bgColor': string
        } => ({
            '--bgColor': color,
            '--progress': `${progress}%`
        })

        return (
            <span style={getStyle(progress, getColor())}>
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