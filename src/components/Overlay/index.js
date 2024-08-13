import Menu from "../Menu";
import {useEffect, useState} from "react";
import useGamepadButtons from "../../hooks/useGamepadButtons";
import {useLocation, useNavigate} from "react-router-dom";

const Overlay = ({ children }) => {
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

    return <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: "fixed",
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
    }}>
        <h1>Overlay</h1>
        <Menu setMenu={setMenu} active={menu} pressedKeys={pressedKeys}/>
    </div>
}

export default Overlay;