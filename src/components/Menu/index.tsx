import React from "react";
import type {ConnectedMonitorType} from "@type/electron.types";
import {Link} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";

import SvgRestart from "../../SVG/restart-2.svg?react";
import SvgSettings from "../../SVG/settings.svg?react";
import SvgShutDown from "../../SVG/shut-down.svg?react";

const Menu = () => {
    const [connectedMonitors, setConnectedMonitors] = React.useActionState<ConnectedMonitorType[]>(electronConnector.getConnectedMonitors, []);

    React.useEffect(() => {
        React.startTransition(setConnectedMonitors)
    }, [])

    const renderLink = (label: string, to: string, icon?: React.ReactNode, extraClasses = "", onClick?: (e: React.MouseEvent) => void) => (
        <li className={`group w-full ${extraClasses}`}>
            <Link 
                to={to} 
                tabIndex={1} 
                onClick={onClick}
                className="flex items-center w-full py-2 px-gap bg-[var(--accent-color)] rounded-theme text-text-secondary text-[3.5vh] transition-all duration-200 ease-in-out group-hover:text-text group-hover:pl-10 group-focus-within:text-text group-focus-within:pl-10 group-active:scale-95 focus:outline-none"
            >
                {icon && <span className="h-[4vh] w-[4vh] mr-gap flex items-center justify-center [&_svg]:h-full [&_svg]:w-full [&_svg]:fill-text-secondary [&_svg]:stroke-text-secondary group-hover:[&_svg]:fill-text group-focus-within:[&_svg]:fill-text group-hover:[&_svg]:stroke-text group-focus-within:[&_svg]:stroke-text group-active:[&_svg]:fill-text group-active:[&_svg]:stroke-text">{icon}</span>}
                {label}
            </Link>
        </li>
    )

    return (
        <div className="h-[calc(100vh-50px)] p-gap-half flex">
            <ul className="list-none flex flex-col gap-2 items-start h-full p-2 glass w-auto min-w-[20vw]">
                {renderLink(i18n.t('Home'), "/")}
                {renderLink(i18n.t('Library'), "/library")}
                {renderLink(i18n.t('Media'), "/media")}
                {renderLink(i18n.t('Download Games'), "/download-games")}
                {renderLink(i18n.t('Download Manager'), "/torrent", null, "mb-auto")}

                {connectedMonitors.map(({DisplayId, DisplayName, Active, Primary}) => (
                    <li key={DisplayId} className={`group w-full border-l-4 transition-colors duration-200 ${Active ? 'border-[#00b100]' : 'border-transparent'}`}>
                        <Link to="/" tabIndex={1} 
                            className="flex items-center w-full py-2 px-gap bg-[var(--accent-color)] rounded-theme text-text-secondary text-[3.5vh] transition-all duration-200 ease-in-out group-hover:text-text group-hover:pl-10 group-focus-within:text-text group-focus-within:pl-10 focus:outline-none"
                            onClick={(e) => {
                                e.preventDefault();
                                electronConnector.setMainDisplay(DisplayId).then(() => {
                                    React.startTransition(setConnectedMonitors)
                                })
                            }}
                        >
                            {Primary ? i18n.t('Main') : i18n.t('Select')}: {DisplayName}
                        </Link>
                    </li>
                ))}

                <hr className="w-full border-white/5 my-1" />
                
                {renderLink(i18n.t('Settings'), "/settings", <SvgSettings/>)}
                {renderLink(i18n.t('Power OFF'), "/", <SvgShutDown/>, "", (e) => {
                    e.preventDefault();
                    electronConnector.systemAction('Stop-Computer')
                })}
                {renderLink(i18n.t('Restart'), "/", <SvgRestart/>, "", (e) => {
                    e.preventDefault();
                    electronConnector.systemAction('Restart-Computer')
                })}
            </ul>
        </div>
    )
}

export default Menu;