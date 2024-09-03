import styles from "./lastcracked.module.scss";
import {useEffect, useRef, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import useAppControls from "../../hooks/useAppControls";
import {currentLang} from "../../helpers/locales";
import RenderContent from "../Game/renderContent";
import RenderMedia from "../Game/renderMedia";
import getColor from "../../helpers/getColor";

const LastCracked = () => {
    const [games, setGames] = useState([]);
    const [steam, setSteam] = useState(null);
    const wrapperRef = useRef(null);
    const [view, setView] = useState('content');

    const toggleViewMode = () => setView(v => v === 'content' ? 'media' : 'content')

    const {init, currentIndex, setActiveIndex} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1,
            lb: toggleViewMode,
            rb: toggleViewMode
        }
    })

    useEffect(() => {
        electronConnector.crackWatchRequest({
            "type": "Last cracked games",
            "limit": 16,
            "sortBy": "crack_date",
            "sortDirection": "asc",
            "showAAA": false
        }).then((g) => {
            setGames(g.games);
            setTimeout(() => {
                init('#cracked li')
            }, 500)
        })
    }, [])

    const getDataFromSteam = ({steam_prod_id, title, release_date}) => {
        if (steam_prod_id) {
            electronConnector.getSteamData({
                appID: steam_prod_id,
                lang: currentLang()
            }).then((data) => {
                setSteam(data[steam_prod_id].data)
            })
        } else {
            setTimeout(() => {
                setSteam({
                    name: title,
                    release_date: {
                        date: new Date(release_date).toLocaleDateString()
                    }
                })
            }, 100)
        }
    }

    useEffect(() => {
        setSteam(null)
        setView('content')
    }, [currentIndex])


    const renderView = () => {
        const currentGame = games[currentIndex];
        if (view === 'content')
            return (<RenderContent game={steam} fields={[{
                label: 'Is AAA',
                value: currentGame.is_AAA ? 'Yes' : null
            }, {
                label: 'Is hot',
                value: currentGame.is_hot ? 'Yes' : null
            }, {
                label: 'Status',
                value: currentGame.readable_status
            }, {
                label: 'Hacked Groups',
                value: currentGame.hacked_groups
            }, {
                label: 'Protections',
                value: currentGame.protections
            }, {
                label: 'Torrent (not recommended)',
                value: currentGame.torrent_link ?
                    <div style={{display: 'inline', cursor: 'pointer'}} onClick={() => {
                        electronConnector.openLink(currentGame.torrent_link)
                    }}>Link</div> : null
            }, {
                label: 'Cracked',
                value: new Date(currentGame.crack_date).toLocaleDateString()
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
                <h2>Cracked Games</h2>
                <ul id={'cracked'}>
                    {games.map((game, index) => (
                        <li key={game.id} aria-label={game.name} tabIndex={1}
                            onClick={() => {
                                setActiveIndex(index);
                                getDataFromSteam(game)
                            }}
                            onFocus={(e) => {
                                const color = getColor(e.target.children[0])
                                wrapperRef.current.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
                            }}>
                            <img src={game.short_image} alt={game.title}/>
                        </li>
                    ))}
                </ul>
            </div>
            {renderAdditionalInfo()}
        </>

    )
}

export default LastCracked