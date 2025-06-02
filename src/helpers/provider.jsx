import {createContext, useEffect, useState} from "react";
import Notifications from "../components/Notifications";
import GamepadApi from "../helpers/gamepad";

export const AppContext = createContext({
    notifications: undefined,
    footerActions: {}
});

const Provider = ({children}) => {
    const [notifications, setNotifications] = useState(null);
    const [footerActions, setFooterActions] = useState({});

    useEffect(() => {
        window.addEventListener("gamepadconnected", ({gamepad}) => {
            const gp = new GamepadApi(gamepad)
            gp.connect();
            window.addEventListener('gamepaddisconnected', (e) => {
                if(e.gamepad.index === gamepad.index) {
                    gp.disconnect()
                }
            })
        })
    },[])

    return (
        <AppContext.Provider value={{setNotifications, footerActions, setFooterActions}}>
            <Notifications notifications={notifications}/>
            {children}
        </AppContext.Provider>
    )
}

export default Provider