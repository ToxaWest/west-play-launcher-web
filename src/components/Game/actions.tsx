import React from "react";
import {useLocation, useNavigate} from "react-router-dom";

import useFooterActions from "../../hooks/useFooterActions";
import useStartGame from "../../hooks/useStartGame";
import type {Game} from "../../types/game.types";

import styles from "./game.module.scss";

import SvgAchievements from '../../SVG/achievement.svg?react'
import SvgContent from '../../SVG/content.svg?react'
import SvgDLC from '../../SVG/dlc.svg?react'
import SvgMedia from '../../SVG/media.svg?react'
import SvgNews from '../../SVG/news.svg?react'

const GameActions = ({game}: {game: Game}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {setFooterActions, removeFooterActions} = useFooterActions();
    const {start, status} = useStartGame(game)

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
        'closed': {button: 'play', modifier: ''},
        'error': {button: 'Can\'t start', modifier: styles.error},
        'running': {button: 'Running', modifier: styles.running},
        'starting': {button: 'Starting...', modifier: ''}
    }

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
    },{
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
            if (index === 0) {
                navigate(buttons.at(-1).url)
            } else {
                navigate(buttons.at(index - 1).url)
            }
        }

        if (direction === 'next') {
            if (index === buttons.length - 1) {
                navigate(buttons.at(0).url)
            } else {
                navigate(buttons.at(index + 1).url)
            }
        }
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
                className={styles.icon + (getActive(url) ? ' ' + styles.activeIcon : '')}
            >
                <SvgImage/>
            </div>
        )
    }

    return (
        <div className={styles.content}>
            <button
                type="button"
                tabIndex={1}
                onClick={start}
                className={styles.playButton + ' ' + (gameState[status].modifier)}
                disabled={status !== 'closed'}
            >
                {gameState[status].button}
            </button>
            <div className={styles.navigation}>
                {buttons.map(renderButton)}
            </div>
        </div>
    )
}

export default GameActions;