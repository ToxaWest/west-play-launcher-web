import React from "react";
import useFooterActions from "@hook/useFooterActions";
import useStartGame from "@hook/useStartGame";
import type {Game} from "@type/game.types";
import {useLocation, useNavigate} from "react-router-dom";

import i18n from "../../helpers/translate";

import SvgAchievements from '../../SVG/achievement.svg?react'
import SvgContent from '../../SVG/content.svg?react'
import SvgDLC from '../../SVG/dlc.svg?react'
import SvgMedia from '../../SVG/media.svg?react'
import SvgNews from '../../SVG/news.svg?react'

const GameActions = ({game}: { game: Game }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {setFooterActions, removeFooterActions} = useFooterActions();
    const {start, status} = useStartGame(game)

    const {
        movies = [],
        screenshots = []
    } = game;

    const buttons = [{
        active: true,
        img: SvgContent,
        url: `/game/${game.id}`
    }, {
        active: Boolean(game.achievements),
        img: SvgAchievements,
        url: `/game/${game.id}/achievements`
    }, {
        active: Boolean(game.steamId),
        img: SvgNews,
        url: `/game/${game.id}/news`
    }, {
        active: Boolean(game.dlcList) && Boolean(game.dlcList.length),
        img: SvgDLC,
        url: `/game/${game.id}/dlc`
    }, {
        active: [...movies, ...screenshots].length > 0,
        img: SvgMedia,
        url: `/game/${game.id}/media`
    }].filter(({active}) => active)

    const toggleViewMode = (direction: 'previous' | 'next') => {
        const index = buttons.findIndex(({url}) => url === window.location.pathname);
        if (direction === 'previous') {
            if (index === 0) navigate(buttons.at(-1).url)
            else navigate(buttons.at(index - 1).url)
        }

        if (direction === 'next') {
            if (index === buttons.length - 1) navigate(buttons.at(0).url)
            else navigate(buttons.at(index + 1).url)
        }
    }

    React.useEffect(() => {
        setFooterActions({
            leftScrollY: {
                button: 'leftScrollY',
                onClick: () => toggleViewMode('previous')
            },
            rightScrollY: {
                button: 'rightScrollY',
                onClick: () => toggleViewMode('next')
            }
        })
        window.scrollTo(0, 0);
        return () => {
            removeFooterActions(['rightScrollY', 'leftScrollY'])
        }
    }, [])

    const getActive = (e: string) => e === location.pathname;

    const gameState = {
        'closed': {button: i18n.t('play'), modifier: ''},
        'error': {button: i18n.t('Can`t start'), modifier: 'bg-[rgba(187,0,33,0.5)] focus:bg-[rgba(187,0,33,0.5)]! hover:bg-[rgba(187,0,33,0.5)]!'},
        'running': {button: i18n.t('Running'), modifier: 'bg-[rgba(0,103,187,0.5)] focus:bg-[rgba(0,103,187,0.5)]! hover:bg-[rgba(0,103,187,0.5)]!'},
        'starting': {button: i18n.t('Starting...'), modifier: ''}
    }


    const renderButton = ({url, img: SvgImage}) => {
        return (
            <div
                key={url}
                onClick={() => {
                    navigate(url);
                    window.scrollTo(0, 0);
                }}
                role="button"
                tabIndex={0}
                className={`w-[45px] h-[45px] p-[5px] bg-theme-transparent rounded-theme cursor-pointer border border-transparent focus:bg-theme hover:bg-theme flex items-center justify-center [&_svg]:fill-text-secondary [&_svg]:max-w-full [&_svg]:max-h-full ${getActive(url) ? 'bg-secondary border-text-secondary [&_svg]:fill-text' : ''}`}
            >
                <SvgImage/>
            </div>
        )
    }

    return (
        <div className="rounded-theme w-[90vw] mx-auto my-[1vw] flex items-start gap-[1vw] relative z-[2]">
            {!game.archive && <button
                type="button"
                tabIndex={1}
                onClick={start}
                className={`font-bold text-[20px] min-w-[250px] shadow-[1px_1px_3px_var(--theme-text-color-seconary)] uppercase transition-colors duration-200 ease-in-out mr-auto focus:bg-[rgba(127,187,0,0.9)]! hover:bg-[rgba(127,187,0,0.9)]! disabled:opacity-90 ${gameState[status].modifier}`}
                disabled={status !== 'closed'}
            >
                {gameState[status].button}
            </button>}
            <div className="ml-auto flex gap-gap">
                {buttons.map(renderButton)}
            </div>
        </div>
    )
}

export default GameActions;