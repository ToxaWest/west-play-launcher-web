import {Outlet, useParams} from "react-router-dom";
import styles from "./game.module.scss";
import {useEffect, useRef} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import useAchievementsWatcher from "../../hooks/useAchievementsWatcher";
import GameActions from "./actions";
import setTheme from "../../helpers/setTheme";
import {getColorByUrl} from "../../helpers/getColor";
import audioHelper from "../../helpers/audioHelper";

const Game = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const {coloredGames, audioVolume = .3, gameAudio = true} = getFromStorage('config').settings;
    const audioRef = useRef(new Audio());
    const canvasRef = useRef();
    useAchievementsWatcher(game.id);

    useEffect(() => {
        if (gameAudio) {
            audioHelper({audioRef, src: game.audio, audioVolume, canvasRef})
        }
        updateThemeColor()
        return () => {
            audioRef.current.pause()
            document.querySelector(':root').style = null;
        }
    }, []);

    const updateThemeColor = () => {
        if (coloredGames) {
            getColorByUrl(game.img_hero).then(color => {
                const theme = setTheme(color);
                Object.entries(theme).forEach(([key, value]) => {
                    document.querySelector(':root').style.setProperty(key, value)
                })
            })
        }
    }

    const audioPlay = () => {
        audioRef.current.play()
    }

    const audioStop = () => {
        audioRef.current.pause()
    }

    return (
        <div className={styles.wrapper}>
            <canvas ref={canvasRef}/>
            <div className={styles.heading}>
                <div className={styles.logo}>
                    <img src={game.img_logo} alt={'logo'}/>
                </div>
                <img src={game.img_hero} className={styles.hero} alt={game.name}/>
            </div>
            <GameActions game={game} audioPlay={audioPlay} audioStop={audioStop}/>
            <Outlet context={{
                audioPlay,
                audioStop
            }}/>
        </div>
    )
}

export default Game;