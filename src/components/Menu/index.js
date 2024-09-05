import {Link} from "react-router-dom";
import styles from './menu.module.scss';
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";
import electronConnector from "../../helpers/electronConnector";
import {ReactComponent as SvgRestart} from "../../SVG/restart-2.svg";
import {ReactComponent as SvgShutDown} from "../../SVG/shut-down.svg";
import {ReactComponent as SvgSettings} from "../../SVG/settings.svg";

const Menu = () => {
    const {init, setActiveIndex} = useAppControls()

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
                        <SvgSettings/> Settings
                    </Link>
                </li>
                <li>
                    <Link to="/" onClick={(e) => {
                        e.preventDefault();
                        electronConnector.shutDownPC()
                    }}>
                        <SvgShutDown/> Shut Down PC
                    </Link>
                </li>
                <li>
                    <Link to="/" onClick={(e) => {
                        e.preventDefault();
                        electronConnector.restartPC()
                    }}>
                        <SvgRestart/> Restart PC
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Menu