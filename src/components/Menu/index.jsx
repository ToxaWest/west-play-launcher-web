import {Link} from "react-router-dom";
import styles from './menu.module.scss';
import electronConnector from "../../helpers/electronConnector";
import SvgRestart from "../../SVG/restart-2.svg?react";
import SvgShutDown from "../../SVG/shut-down.svg?react";
import SvgSettings from "../../SVG/settings.svg?react";

const Menu = () => {
    return (
        <div className={styles.wrapper}>
            <ul>
                <li>
                    <Link to="/" tabIndex={1}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/library" tabIndex={1}>
                        Library
                    </Link>
                </li>
                <li style={{marginTop: 'auto'}}>
                    <Link to="/settings" tabIndex={1}>
                        <SvgSettings/> Settings
                    </Link>
                </li>
                <li>
                    <Link to="/" tabIndex={1} onClick={(e) => {
                        e.preventDefault();
                        electronConnector.systemAction('Stop-Computer')
                    }}>
                        <SvgShutDown/> Shut Down PC
                    </Link>
                </li>
                <li>
                    <Link to="/" tabIndex={1} onClick={(e) => {
                        e.preventDefault();
                        electronConnector.systemAction('Restart-Computer')
                    }}>
                        <SvgRestart/> Restart PC
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Menu