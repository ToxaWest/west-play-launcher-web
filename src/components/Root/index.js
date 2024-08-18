import Menu from "../Menu";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useRef} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import {AppContext} from "../../helpers/provider";
import useAppControls from "../../hooks/useAppControls";
import useNotification from "../../hooks/useNotification";
import Clock from "../Clock";

const Root = () => {
    const navigate = useNavigate();
    const timeout = useRef(null);
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
        const body = document.querySelector('html');
        document.addEventListener('mousemove', () => {
            if (timeout.current !== undefined) {
                body.style.removeProperty('cursor');
                body.style.removeProperty('pointer-events');
                window.clearTimeout(timeout.current);
            }
            timeout.current = setTimeout(() => {
                body.style.setProperty('cursor', 'none');
                body.style.setProperty('pointer-events', 'none');
            }, 2000)
        })
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