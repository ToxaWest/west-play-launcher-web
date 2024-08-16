import Menu from "../Menu";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useContext, useEffect} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import {AppContext} from "../../helpers/provider";
import useAppControls from "../../hooks/useAppControls";
import useNotification from "../../hooks/useNotification";
import Clock from "../Clock";
import electronConnector from "../../helpers/electronConnector";

const Root = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {setMenu, active} = useContext(AppContext);
    const notifications = useNotification();

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
        if (location.pathname !== '/') {
            navigate(
                back[location.pathname.split('/')[1]]
            )
        }
    }

    useEffect(() => {
        setMenu(false)
    }, [location])

    useEffect(() => {
        window.addEventListener("gamepadconnected", () => {
            notifications({
                img: '/assets/controller/xbox-control-for-one.svg',
                status: 'success',
                name: 'Gamepad connected',
                description: 'Let\'s Play!'
            })
        })
        init()
    }, [])

    return (
        <div className={styles.wrapper}>
            <Clock/>
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