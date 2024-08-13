import Menu from "../Menu";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import styles from './root.module.scss';
import useGamepadButtons from "../../hooks/useGamepadButtons";
import Footer from "../Footer";
import {AppContext} from "../../helpers/provider";
import useAppControls from "../../hooks/useAppControls";

const Root = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {setMenu, active} = useContext(AppContext);

    const {init} = useAppControls({
        map: {
            'select': () => setMenu(a => !a),
            'b': () => {
                if (!active) {
                    setMenu(false);
                }
                backButton()
            },
            'a': () => {
                document.activeElement?.click()
            }
        },
        abstract: true
    })

    const back = {
        'game': '/',
        'settings': '/'
    }

    const backButton = () => {
        if (location.pathname === '/') {
            setMenu(false)
        } else {
            navigate(back[location.pathname.split('/')[1]])
        }
    }

    useEffect(() => {
        setMenu(false)
    }, [location])

    useEffect(() => {
        init()
    },[])

    return (
        <div className={styles.wrapper}>
            <div className={styles.menu + (!active ? ' ' + styles.active : '')} id="menu">
                <Menu/>
            </div>
            <div className={styles.content + (!active ? ' ' + styles.menuActive : '')}>
                <Outlet/>
            </div>
            <Footer backButton={backButton}/>
        </div>
    )
}
export default Root;