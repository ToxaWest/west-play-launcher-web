import {Link} from "react-router-dom";
import styles from './menu.module.scss';
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";
import electronConnector from "../../helpers/electronConnector";

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
                    <Link to="/lastCracked">Last Cracked games</Link>
                </li>
                <li>
                    <Link to="/freeGames">Free games</Link>
                </li>
                <li style={{marginTop: 'auto'}}>
                    <Link to="/settings">
                        <img src='/assets/settings.svg' alt={'settings'}/> Settings
                    </Link>
                </li>
                <li>
                    <Link to="/" onClick={(e) => {
                        e.preventDefault();
                        electronConnector.shutDownPC()
                    }}><img src='/assets/shut-down.svg' alt="shut down"/> Shut Down PC</Link>
                </li>
                <li>
                    <Link to="/" onClick={(e) => {
                        e.preventDefault();
                        electronConnector.restartPC()
                    }}><img src='/assets/restart-2.svg' alt="restart"/> Restart PC</Link>
                </li>
            </ul>
        </div>
    )
}

export default Menu