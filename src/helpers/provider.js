import {createContext, useEffect, useState} from "react";
import useGamepadButtons from "../hooks/useGamepadButtons";
import Notifications from "../components/Notifications";
import electronConnector from "./electronConnector";

export const AppContext = createContext({
    active: false,
    pressedKeys: [],
    notifications: null,
});

const Provider = ({children}) => {
    const [menu, setMenu] = useState(false);
    const {pressedKeys} = useGamepadButtons();
    const [notifications, setNotifications] = useState(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        electronConnector.onVisibilityChange(setVisible)
    }, [])

    return (
        <AppContext.Provider value={{active: !menu, setMenu, pressedKeys, setNotifications, visible}}>
            <Notifications notifications={notifications}/>
            {children}
        </AppContext.Provider>
    )
}

export default Provider