import {Outlet} from "react-router-dom";
import {useEffect} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import Clock from "../Clock";
import useAppControls from "../../hooks/useAppControls";
import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import {modalIsActive} from "../../helpers/modalIsActive";

const Root = () => {
    const {init} = useAppControls()
    const {videoBg} = getFromStorage('config').settings;

    useEffect(() => {
        const {settings: {currentLang, theme, steamid}} = getFromStorage('config');
        electronConnector.setBeData({
            lang: currentLang,
            country: 'UA',
            theme,
            steamid
        })
        const body = document.querySelector('html');
        init('#contentWrapper')
        modalIsActive((active) => {
            init(active ? '#modal' : '#contentWrapper')
        })
        document.addEventListener('mousemove', () => {
            body.style.removeProperty('cursor');
            body.style.removeProperty('pointer-events');
        })
    }, [])

    const renderWrapper = (children) => {
        if (videoBg) {
            return (
                <div className={styles.videoBg}>
                    <video src={videoBg} autoPlay={true} muted={true} loop={true} className={styles.video} />
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