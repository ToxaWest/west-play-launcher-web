import {Link} from "react-router-dom";
import styles from './menu.module.scss';
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";

const Menu = () => {
    const {init, setActiveIndex} = useAppControls({
        map: {
            'bottom': (i) => i + 1,
            'top': (i) => i - 1,
        }
    })

    useEffect(() => {
        init('#main-menu a');
        setActiveIndex(0)
    }, []);

    return (
        <div className={styles.wrapper} id="main-menu">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/library">Library</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
            </ul>
        </div>
    )
}

export default Menu