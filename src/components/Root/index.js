import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import Clock from "../Clock";
import useGamepadButtons from "../../hooks/useGamepadButtons";
import usePrevPath from "../../hooks/usePrevPath";

const Root = () => {
    const {prevPath} = usePrevPath()
    const navigate = useNavigate();
    const location = useLocation();
    const refBack = useRef(null);
    useGamepadButtons();
    const back = {
        '': '/',
        'game': '/',
        'settings': '/',
        'menu': '/'
    }

    const backButton = () => {
        if (refBack.current?.url) {
            navigate(refBack.current.url);
        } else {
            navigate(
                back[location.pathname.split('/')[1]]
            )
        }
    }

    useEffect(() => {
        refBack.current = prevPath
    }, [prevPath])

    const menuButton = () => {
        if (window.location.pathname === '/menu') {
            navigate(-1);
        } else {
            navigate('/menu')
        }
    }

    const listener = ({detail}) => {
        const map = {
            select: menuButton,
            b: backButton,
            a: () => {
                if (document.activeElement) {
                    document.activeElement.click()
                }
            }
        }
        if (map[detail]) {
            map[detail]()
        }
    }

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        const body = document.querySelector('html');
        document.addEventListener('mousemove', () => {
            body.style.removeProperty('cursor');
            body.style.removeProperty('pointer-events');
        })
    }, [])

    return (
        <div className={styles.wrapper}>
            <Clock/>
            <div className={styles.content}>
                <Outlet/>
            </div>
            <Footer backButton={backButton} menuButton={menuButton}/>
        </div>
    )
}
export default Root;