import styles from "./game.module.scss";
import {useLocation, useNavigate} from "react-router-dom";
import useStartGame from "../../hooks/useStartGame";
import SvgContent from '../../SVG/content.svg?react'
import SvgAchievements from '../../SVG/achievement.svg?react'
import SvgMedia from '../../SVG/media.svg?react'
import SvgNews from '../../SVG/news.svg?react'
import SvgDLC from '../../SVG/dlc.svg?react'
import {useEffect} from "react";
import useFooterActions from "../../hooks/useFooterActions";

const GameActions = ({game}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {setFooterActions, removeFooterActions} = useFooterActions();
    const {start, status} = useStartGame(game)

    useEffect(() => {
        setFooterActions({
            rightScrollY: {
                button: 'rightScrollY',
                onClick: () => toggleViewMode('next')
            },
            leftScrollY: {
                button: 'leftScrollY',
                onClick: () => toggleViewMode('previous')
            }
        })
        window.scrollTo(0, 0);
        return () => {
            removeFooterActions(['rightScrollY', 'leftScrollY'])
        }
    }, [])

    const getActive = (e) => e === location.pathname;

    const gameState = {
        'closed': {button: 'play', modifier: ''},
        'starting': {button: 'Starting...', modifier: ''},
        'running': {button: 'Running', modifier: styles.running},
        'error': {button: 'Can\'t start', modifier: styles.error}
    }

    const {
        movies = [],
        screenshots = []
    } = game;

    const buttons = [{
        url: `/game/${game.id}`,
        img: SvgContent,
        active: true
    }, {
        url: `/game/${game.id}/achievements`,
        img: SvgAchievements,
        active: Boolean(game.achievements)
    }, {
        url: `/game/${game.id}/news`,
        img: SvgNews,
        active: Boolean(game.steamId)
    },{
        url: `/game/${game.id}/dlc`,
        img: SvgDLC,
        active: Boolean(game.dlcList) && Boolean(game.dlcList.length)
    }, {
        url: `/game/${game.id}/media`,
        img: SvgMedia,
        active: [...movies, ...screenshots].length > 0
    }].filter(({active}) => active)

    const toggleViewMode = (direction) => {
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
                className={styles.icon + (getActive(url) ? ' ' + styles.activeIcon : '')}
            >
                <SvgImage/>
            </div>
        )
    }

    return (
        <div className={styles.content}>
            <button
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