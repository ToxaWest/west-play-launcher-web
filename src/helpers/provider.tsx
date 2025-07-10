import React from "react";

import Notifications from "../components/Notifications";
import GamepadApi from "../helpers/gamepad";
import type {AppContextType} from "../types/provider.types";

export const AppContext = React.createContext<AppContextType>({
    footerActions: {},
    notifications: null,
    setFooterActions: () => {},
    setNotifications: () => {}
});

const Provider = ({children}) => {
    const [notifications, setNotifications] = React.useState<AppContextType["notifications"]>(null);
    const [footerActions, setFooterActions] = React.useState<AppContextType["footerActions"]>({});

    React.useEffect(() => {
        window.addEventListener("gamepadconnected", ({gamepad}) => {
            const gp = new GamepadApi(gamepad)
            gp.connect();
            window.addEventListener('gamepaddisconnected', (e) => {
                if (e.gamepad.index === gamepad.index) {
                    gp.disconnect()
                }
            })
        })
    }, [])

    return (
        // eslint-disable-next-line @eslint-react/no-unstable-context-value
        <AppContext value={{footerActions, setFooterActions, setNotifications}}>
            <Notifications notifications={notifications}/>
            {children}
        </AppContext>
    )
}

export default Provider