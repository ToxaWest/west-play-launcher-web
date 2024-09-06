import {useEffect, useRef, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from '../LastCracked/lastcracked.module.scss';
import {getColorByUrl} from "../../helpers/getColor";
import RenderContent from "../Game/renderContent";
import RenderMedia from "../Game/renderMedia";
import useAppControls from "../../hooks/useAppControls";
import {currentLang} from "../../helpers/locales";

const disabledStores = ["109"]

const FreeGames = () => {
    const [games, setGames] = useState([]);
    const [steam, setSteam] = useState(null);
    const wrapperRef = useRef(null);
    const [view, setView] = useState('content');
    const [currentGame, setCurrentGame] = useState(0)
    const toggleViewMode = () => setView(v => v === 'content' ? 'media' : 'content')

    useAppControls({
        map: {
            lb: toggleViewMode,
            rb: toggleViewMode
        }
    })
    useEffect(() => {
        electronConnector.getFreeGames().then((elements) => {
            setGames(elements.filter(game => !disabledStores.includes(game.shopId)))
        })
    }, []);

    const getDataFromSteam = (game) => {
        const {title} = game;
        electronConnector.steamSearch({params: title}).then((data) => {
            let appid
            if (data.length === 1) {
                appid = data[0].appid
            } else {
                appid = data.find(({name}) => name === title)?.appid;
            }
            if (appid) {
                electronConnector.getSteamData({
                    appID: appid,
                    lang: currentLang()
                }).then((data) => {
                    setSteam(data[appid].data)
                })
            } else {
                setSteam({
                    name: title
                })
            }
        })
    }

    const renderGame = (game) => {
        const img = game.image.split('_')[0] + '_616xr353.jpg'
        return (
            <li key={game.containerGameId}
                tabIndex={1}
                onClick={(e) => {
                    e.target.focus()
                    getDataFromSteam(game)
                }}
                onFocus={() => {
                    setCurrentGame(game);
                    getColorByUrl(img).then(color => {
                        wrapperRef.current.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
                    })
                }}>
                <img src={img} alt={game.name}/>
            </li>
        )
    }

    const renderTime = ({endTime, startTime}) => {
        if (endTime) {
            return (
                <>
                    {new Date(parseInt(startTime) * 1000).toLocaleDateString()} - {new Date(parseInt(endTime) * 1000).toLocaleDateString()}
                </>
            )
        }

        return <>From {new Date(parseInt(startTime) * 1000).toLocaleDateString()}</>
    }

    const renderSvg = (platform) => {
        if (!platform) {
            return null
        }

        return <svg style={{width: '32px', height: '16px'}}
                    dangerouslySetInnerHTML={{__html: platform.replace('/images/', 'https://gg.deals/images/')}}/>
    }

    useEffect(() => {
        setSteam(null)
        setView('content')
    }, [currentGame])


    const renderView = () => {
        if (view === 'content')
            return (<RenderContent game={steam} fields={[{
                label: 'Platform',
                value: renderSvg(currentGame.platform)
            }, {
                label: 'Shop',
                value: currentGame.shopName
            }, {
                label: 'Free period',
                value: renderTime(currentGame)
            }, {
                label: 'Store Link',
                value: currentGame.link ?
                    <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                        electronConnector.openLink(currentGame.link)
                    }}>Link</div> : null
            }]}/>)
        if (view === 'media')
            return <RenderMedia game={steam}/>
    }

    const renderAdditionalInfo = () => {
        if (steam) {
            return (
                <>
                    <div className={styles.navigation}>
                        <img src={'/assets/controller/left-bumper.svg'} alt={'prev'} onClick={toggleViewMode}/>
                        <div className={view === 'content' ? styles.navActive : ''} onClick={() => setView('content')}>
                            Description
                        </div>
                        <div className={view === 'media' ? styles.navActive : ''} onClick={() => setView('media')}>
                            Media
                        </div>
                        <img src={'/assets/controller/right-bumper.svg'} alt={'next'}
                             onClick={toggleViewMode}/>
                    </div>
                    {renderView()}
                </>
            )
        }
        return null
    }

    return (
        <>
            <div className={styles.wrapper} ref={wrapperRef}>
                <h2>Free Games ({games.length})</h2>
                <ul id="freeGames">
                    {games.map(renderGame)}
                </ul>
            </div>
            {renderAdditionalInfo()}
        </>
    )
}

export default FreeGames;