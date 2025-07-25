import React from "react";
import type {AppContextType} from "@type/provider.types";

import Loader from "../components/Loader";
import Notifications from "../components/Notifications";
import GamepadApi from "../helpers/gamepad";

import i18n from "./translate";

export const AppContext = React.createContext<AppContextType>({
    footerActions: {},
    notifications: null,
    setFooterActions: () => {
    },
    setNotifications: () => {
    }
});

const Provider = ({children}) => {
    const [notifications, setNotifications] = React.useState<AppContextType["notifications"]>(null);
    const [footerActions, setFooterActions] = React.useState<AppContextType["footerActions"]>({});
    const [loading, setLoading] = React.useState<boolean>(true);
    React.useEffect(() => {
        window.addEventListener("gamepadconnected", ({gamepad}) => {
            const gp = new GamepadApi(gamepad)
            gp.connect();
            window.addEventListener('gamepaddisconnected', (e) => {
                if (e.gamepad.index === gamepad.index) gp.disconnect()
            })
        })
        i18n.init().then(() => {
            setLoading(false);
        })
    }, [])

    return (
        // eslint-disable-next-line @eslint-react/no-unstable-context-value
        <AppContext value={{footerActions, setFooterActions, setNotifications}}>
            <Notifications notifications={notifications}/>
            {loading ? <Loader loading={loading}/> : children}
        </AppContext>
    )
}

export default Provider