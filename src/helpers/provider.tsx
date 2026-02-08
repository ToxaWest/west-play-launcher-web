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
    const gamepadsRef = React.useRef<Map<number, GamepadApi>>(new Map());

    React.useEffect(() => {
        const handleGamepadConnected = (e: GamepadEvent) => {
            const { gamepad } = e;
            const gp = new GamepadApi(gamepad);
            gp.connect();
            gamepadsRef.current.set(gamepad.index, gp);
        };

        const handleGamepadDisconnected = (e: GamepadEvent) => {
            const { gamepad } = e;
            const gp = gamepadsRef.current.get(gamepad.index);
            if (gp) {
                gp.disconnect();
                gamepadsRef.current.delete(gamepad.index);
            }
        };

        window.addEventListener("gamepadconnected", handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

        i18n.init().then(() => {
            setLoading(false);
        });

        return () => {
            window.removeEventListener("gamepadconnected", handleGamepadConnected);
            window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
            // Clean up any remaining gamepads
            gamepadsRef.current.forEach(gp => gp.disconnect());
            gamepadsRef.current.clear();
        };
    }, []);

    return (
         
        <AppContext value={{footerActions, setFooterActions, setNotifications}}>
            <Notifications notifications={notifications}/>
            {loading ? <Loader loading={loading}/> : children}
        </AppContext>
    )
}

export default Provider