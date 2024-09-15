import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import Clock from "../Clock";
import useAppControls from "../../hooks/useAppControls";
import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import HeaderMenu from "../HeaderMenu";

const Root = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const back = {
        '': '/',
        'game': '/',
        'settings': '/'
    }

    const backButton = () => {
        if (window.location.pathname === '/menu') {
            navigate(-1);
        } else {
            if (window.__back) {
                navigate(window.__back.url)
            } else {
                navigate(back[location.pathname.split('/').at(1)])
            }
        }
    }

    const menuButton = () => {
        if (window.location.pathname === '/menu') {
            navigate(-1);
        } else {
            navigate('/menu')
        }
    }

    const {init} = useAppControls({
        map: {
            select: menuButton,
            b: backButton,
            a: () => {
                if (document.activeElement) {
                    document.activeElement.click()
                }
            }
        }
    })

    useEffect(() => {
        const {settings: {steam_api_key, currentLang, rpcs3, theme, egs_profile}} = getFromStorage('config');
        electronConnector.setBeData({
            steam_api_key,
            lang: currentLang,
            country: 'UA',
            rpcs3Path: rpcs3,
            egs_profile,
            theme
        })
        const body = document.querySelector('html');
        init()
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
            <Footer backButton={backButton} menuButton={menuButton}/>
        </div>
    )
}
export default Root;