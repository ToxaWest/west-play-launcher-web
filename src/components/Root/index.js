import Menu from "../Menu";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from './root.module.scss';
import useGamepadButtons from "../../hooks/useGamepadButtons";
import Footer from "../Footer";

const Root = () => {
    const [menu, setMenu] = useState(false);
    const {pressedKeys} = useGamepadButtons();
    const navigate = useNavigate();
    const location = useLocation();

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
        if (pressedKeys.includes('select')) {
            setMenu((v) => {
                return !v
            })
        }
        if (pressedKeys.includes('b')) {
            if (menu) {
                setMenu(false);
            }
            backButton()
        }

        if (pressedKeys.includes('a')) {
            document.activeElement?.click()
        }

    }, [pressedKeys])

    return (
        <div className={styles.wrapper}>
            <div className={styles.menu + (menu ? ' ' + styles.active : '')} id="menu">
                <Menu active={menu} setMenu={setMenu} pressedKeys={pressedKeys}/>
            </div>
            <div className={styles.content + (menu ? ' ' + styles.menuActive : '')}>
                <Outlet context={{active: !menu, pressedKeys}}/>
            </div>
            <Footer toggleMenu={() => setMenu(!menu)} pressedKeys={pressedKeys} backButton={backButton}/>
        </div>
    )
}
export default Root;