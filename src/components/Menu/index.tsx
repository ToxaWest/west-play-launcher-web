import React from "react";
import type {ConnectedMonitorType} from "@type/electron.types";
import {Link} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";

import styles from './menu.module.scss';

import SvgRestart from "../../SVG/restart-2.svg?react";
import SvgSettings from "../../SVG/settings.svg?react";
import SvgShutDown from "../../SVG/shut-down.svg?react";

const Menu = () => {
    const [connectedMonitors, setConnectedMonitors] = React.useState<ConnectedMonitorType[]>([]);

    React.useEffect(() => {
        electronConnector.getConnectedMonitors().then(setConnectedMonitors)
    }, [])

    const renderMonitors = ({id, name, active, primary}: ConnectedMonitorType) => {

        return (
            <li key={id} className={active ? styles.active : ''}>
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
                <li style={{marginBottom: 'auto'}}>
                    <Link to="/media" tabIndex={1}>
                        Media
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