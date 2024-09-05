import styles from "./game.module.scss";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";
import useStartGame from "../../hooks/useStartGame";
import {ReactComponent as SvgContent} from '../../SVG/content.svg'
import {ReactComponent as SvgAchievements} from '../../SVG/achievement.svg'
import {ReactComponent as SvgMedia} from '../../SVG/media.svg'

const GameActions = ({game, audioStop}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {init} = useAppControls({
        map: {
            rb: () => {
                toggleViewMode('next')
            },
            lb: () => {
                toggleViewMode('previous')
            }
        }
    })
    const {start, status, exePath} = useStartGame(game)
    const getActive = (e) => e === location.pathname;

    const gameState = {
        'closed': {button: 'play', modifier: ''},
        'starting': {button: 'Starting...', modifier: ''},
        'running': {button: 'Running', modifier: styles.running},
    }

    useEffect(() => {
        init('#game-actions button');
    }, [])

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
                    navigate(url)
                }}
                className={styles.icon + (getActive(url) ? ' ' + styles.activeIcon : '')}
            >
                <SvgImage/>
            </div>
        )
    }

    return (
        <div className={styles.content} id={'game-actions'}>
            <button
                onClick={() => {
                    start();
                    audioStop()
                }}
                className={styles.playButton + ' ' + (gameState[status].modifier)}
                disabled={status !== 'closed'}
                style={{opacity: exePath ? 1 : 0.7}}
            >
                {gameState[status].button}
            </button>
            <div className={styles.navigation}>
                <img src={'/assets/controller/left-bumper.svg'} alt={'prev'}
                     onClick={() => toggleViewMode('previous')}/>
                {buttons.map(renderButton)}
                <img src={'/assets/controller/right-bumper.svg'} alt={'next'}
                     onClick={() => toggleViewMode('next')}/>
            </div>
        </div>
    )
}

export default GameActions;