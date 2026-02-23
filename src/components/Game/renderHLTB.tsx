import React from "react";
import {secondsToHms} from "@hook/usePlayTime";
import type {Game} from "@type/game.types";

import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";

const RenderHLTB = ({game}: { game: Game }) => {
    if (!game.hltb) return null
    const {allStylesTime, completionistTime, mainExtraTime, mainTime} = game.hltb
    const playTime = getFromStorage('playTime')[game.id] || 0

    const renderItem = (label: string, value?: number) => {
        if (!value) return null
        const percent = (playTime / (value * 1000)) * 100;
        const progress = percent > 100 ? 100 : percent;

        return (
            <span 
                style={{ '--bgColor': `rgba(0, 255, 0, ${progress / 100})`, '--progress': `${progress}%` } as React.CSSProperties}
                className="p-theme text-[1vw] bg-theme-transparent rounded-theme flex flex-col justify-center items-center gap-gap-half relative after:content-[''] after:absolute after:inset-y-0 after:left-0 after:w-[var(--progress)] after:bg-[var(--bgColor)] after:z-[-1] after:rounded-[inherit]"
            >
                {secondsToHms(value * 1000)}<strong className="text-[0.7vw]">{label}</strong>
            </span>
        )
    }

    return (
        <div className="flex justify-center w-full items-center gap-gap-half my-gap mx-auto">
            {renderItem(i18n.t('Main Story'), mainTime)}
            {renderItem(i18n.t('Main + Sides'), mainExtraTime)}
            {renderItem(i18n.t('Completionist'), completionistTime)}
            {renderItem(i18n.t('All Styles'), allStylesTime)}
        </div>
    )
}

export default RenderHLTB