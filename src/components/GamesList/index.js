import styles from "./GamesList.module.scss";
import {useEffect, useRef, useState} from "react";
import {getColorByUrl} from "../../helpers/getColor";
import RenderContent from "../Game/renderContent";
import RenderMedia from "../Game/renderMedia";
import useAppControls from "../../hooks/useAppControls";
import electronConnector from "../../helpers/electronConnector";

const GamesList = ({
                       games,
                       title,
                       getFields,
                       renderInfoWrapper = () => null,
                       reset = () => null,
                       getImage = (g) => g.short_image,
                       getAppId
                   }) => {

    const wrapperRef = useRef(null);
    const [view, setView] = useState('content');
    const [currentGame, setCurrentGame] = useState(null)
    const [steam, setSteam] = useState(null);

    const toggleViewMode = () => setView(v => v === 'content' ? 'media' : 'content')

    useAppControls({
        map: {
            lb: toggleViewMode,
            rb: toggleViewMode
        }
    })

    useEffect(() => {
        setSteam(null)
        setView('content')
        reset()
    }, [currentGame])

    const getData = async (game) => {
        const {title} = game
        const {appID, fields} = await getAppId(game)
        if (appID) {
            electronConnector.getGameByID(appID).then(setSteam)
        } else {
            setTimeout(() => {
                setSteam({
                    name: title,
                    ...fields
                })
            }, 100)
        }
    }


    const renderGame = (game) => {
        const img = getImage(game)
        return (
            <li key={game.id}
                tabIndex={1}
                onClick={() => {
                    getData(game)
                }}
                onFocus={() => {
                    setCurrentGame(game)
                    getColorByUrl(img).then(color => {
                        wrapperRef.current.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`
                    })
                }}>
                <img src={img} alt={game.title} loading={"lazy"}/>
                <div className={styles.infoWrapper}>
                    {renderInfoWrapper(game)}
                </div>
            </li>
        )
    }

    const renderView = () => {
        if (view === 'content')
            return (<RenderContent game={steam} fields={getFields(currentGame)}/>)
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
                        <img src={'/assets/controller/right-bumper.svg'} alt={'next'} onClick={toggleViewMode}/>
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
                <h2>{title}</h2>
                <ul>
                    {games.map(renderGame)}
                </ul>
            </div>
            {renderAdditionalInfo()}
        </>
    )
}

export default GamesList;