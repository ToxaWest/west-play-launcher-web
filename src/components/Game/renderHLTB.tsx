import React from "react";
import {secondsToHms} from "@hook/usePlayTime";
import type {Game} from "@type/game.types";

import i18n from "../../helpers/translate";

import styles from './hltb.module.scss';

const RenderHLTB = ({game}: { game: Game }) => {
    if (!game.hltb) return null
    const {allStylesTime, completionistTime, mainExtraTime, mainTime} = game.hltb

    const renderItem = (label: string, value?: number) => {
        if (!value) return null
        return (
            <span>
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