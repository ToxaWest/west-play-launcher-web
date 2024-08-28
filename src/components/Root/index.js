import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import Clock from "../Clock";
import useGamepadButtons from "../../hooks/useGamepadButtons";

const Root = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useGamepadButtons();
    const back = {
        '': '/',
        'game': '/',
        'settings': '/',
        'menu': '/'
    }

    const backButton = () => {
        navigate(
            back[location.pathname.split('/')[1]]
        )
    }

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