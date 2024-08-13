import {Link} from "react-router-dom";
import styles from './menu.module.scss';
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";

const Menu = () => {
    const {init} = useAppControls({
        map: {
            'bottom': (i) => i + 1,
            'top': (i) => i - 1,
        },
        isMenu: true
    })

    useEffect(() => {
        init({
            selector: '#main-menu a'
        })
    }, []);

    return (
        <div className={styles.wrapper} id="main-menu">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
                <li>
                    <Link to="/" onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        window.electronAPI.openOverlay()
                    }}>Overlay</Link>
                </li>
            </ul>
        </div>

    )
}

export default Menu