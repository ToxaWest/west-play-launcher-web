import React from "react";
import {useGamepadManager} from "@hook/useGamepadManager";
import type {AppContextType} from "@type/provider.types";

import Loader from "../components/Loader";
import Notifications from "../components/Notifications";

import i18n from "./translate";

export const AppContext = React.createContext<AppContextType>({
    footerActions: {},
    init: () => {},
    notifications: null,
    setFooterActions: () => {},
    setMap: () => {},
    setNotifications: () => {}
});

const Provider = ({children}: {children: React.ReactNode}) => {
    const [notifications, setNotifications] = React.useState<AppContextType["notifications"]>(null);
    const [footerActions, setFooterActions] = React.useState<AppContextType["footerActions"]>({});
    const [loading, setLoading] = React.useState<boolean>(true);
    
    // Externalized gamepad and navigation logic
    const {init, setMap} = useGamepadManager({setNotifications});

    React.useEffect(() => {
        i18n.init().then(() => {
            setLoading(false);
        });
    }, []);

    const contextValue = React.useMemo(() => ({
        footerActions,
        init,
        notifications,
        setFooterActions,
        setMap,
        setNotifications
    }), [footerActions, init, notifications, setMap]);

    return (
        <AppContext value={contextValue}>
            <Notifications notifications={notifications}/>
            {loading ? <Loader loading={loading}/> : children}
        </AppContext>
    )
}

export default Provider