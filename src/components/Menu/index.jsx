import {Link} from "react-router-dom";
import styles from './menu.module.scss';
import electronConnector from "../../helpers/electronConnector";
import SvgRestart from "../../SVG/restart-2.svg?react";
import SvgShutDown from "../../SVG/shut-down.svg?react";
import SvgSettings from "../../SVG/settings.svg?react";
import {getFromStorage} from "../../helpers/getFromStorage";
import {useEffect, useState} from "react";

const Menu = () => {
    const {videoBg} = getFromStorage('config').settings;
    const [connectedMonitors, setConnectedMonitors] = useState([]);
    const renderWrapper = (children) => {
        if (videoBg) {
            return (
                <div className={styles.videoBg}>
                    <video src={videoBg} autoPlay={true} muted={true} loop={true}/>
                    {children}
                </div>
            )
        }

        return children
    }

    useEffect(() => {
        electronConnector.getConnectedMonitors().then(setConnectedMonitors)
    }, [])

    const renderMonitors = ({id, name, active, primary}) => {

        return (
            <li key={id} className={active ? [styles.active] : ''}>
                <Link to="/" tabIndex={1} onClick={(e) => {
                    e.preventDefault();
                    electronConnector.setMainDisplay(id).then(() => {
                        electronConnector.getConnectedMonitors().then(setConnectedMonitors)
                    })
                }}>
                    {primary ? 'Main' : 'Select'}: {name}
                </Link>
            </li>
        )
    }

    return renderWrapper(
        <div className={styles.wrapper}>
            <ul>
                <li>
                    <Link to="/" tabIndex={1}>
                        Home
                    </Link>
                </li>
                <li style={{marginBottom: 'auto'}}>
                    <Link to="/library" tabIndex={1}>
                        Library
                    </Link>
                </li>
                {connectedMonitors.map(renderMonitors)}
                <li>
                    <Link to="/settings" tabIndex={1}>
                        <SvgSettings/> Settings
                    </Link>
                </li>
                <li>
                    <Link to="/" tabIndex={1} onClick={(e) => {
                        e.preventDefault();
                        electronConnector.systemAction('Stop-Computer')
                    }}>
                        <SvgShutDown/> Power OFF
                    </Link>
                </li>
                <li>
                    <Link to="/" tabIndex={1} onClick={(e) => {
                        e.preventDefault();
                        electronConnector.systemAction('Restart-Computer')
                    }}>
                        <SvgRestart/> Restart
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Menu