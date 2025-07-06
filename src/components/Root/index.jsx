import {Outlet} from "react-router-dom";
import {useEffect} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import Clock from "../Clock";
import useAppControls from "../../hooks/useAppControls";
import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import {modalIsActive} from "../../helpers/modalIsActive";

const Root = () => {
    const {init} = useAppControls()
    const {videoBg} = getFromStorage('config').settings;

    useEffect(() => {
        const {settings: {currentLang, theme, steamProfile}} = getFromStorage('config');
        electronConnector.setBeData({
            lang: currentLang,
            country: 'UA',
            theme,
            steamProfile
        })
        init('#contentWrapper')
        modalIsActive((active) => {
            init(active ? '#modal' : '#contentWrapper')
        })
        document.addEventListener('mousemove', () => {
            document.documentElement.style.cursor = '';
            document.documentElement.style.pointerEvents = '';
        })
        electronConnector.getPlayTime(getFromStorage('games') || []).then(d => {
            const playTime = getFromStorage('playTime');
            const lastPlayed = getFromStorage('lastPlayed');
            Object.entries(d).forEach(([key, value]) => {
                playTime[key] = value.playTime;
                lastPlayed[key] = value.lastPlayed;
            })
            setToStorage('playTime', playTime);
            setToStorage('lastPlayed', lastPlayed);

        })
    }, [])

    const renderWrapper = (children) => {
        if (videoBg) {
            return (
                <div className={styles.videoBg}>
                    <video src={videoBg} autoPlay={true} muted={true} loop={true} className={styles.video}/>
                    {children}
                </div>
            )
        }

        return children
    }

    return renderWrapper(
        <div className={styles.wrapper}>
            <Clock/>
            <div className={styles.content} id="contentWrapper">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}
export default Root;