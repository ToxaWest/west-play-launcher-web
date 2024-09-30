import {Outlet} from "react-router-dom";
import {useEffect} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import Clock from "../Clock";
import useAppControls from "../../hooks/useAppControls";
import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import HeaderMenu from "../HeaderMenu";
import {modalIsActive} from "../../helpers/modalIsActive";

const Root = () => {
    const {init} = useAppControls()

    useEffect(() => {
        const {settings: {steam_api_key, currentLang, rpcs3, theme, egs_profile, steamid}} = getFromStorage('config');
        electronConnector.setBeData({
            steam_api_key,
            lang: currentLang,
            country: 'UA',
            rpcs3Path: rpcs3,
            egs_profile,
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

    return (
        <div className={styles.wrapper}>
            <HeaderMenu/>
            <Clock/>
            <div className={styles.content} id="contentWrapper">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}
export default Root;