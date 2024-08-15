import {createContext, useState} from "react";
import useGamepadButtons from "../hooks/useGamepadButtons";
import Notifications from "../components/Notifications";

export const AppContext = createContext({
    active: false,
    pressedKeys: [],
    notifications: null,
});

const Provider = ({children}) => {
    const [menu, setMenu] = useState(false);
    const {pressedKeys} = useGamepadButtons();
    const [notifications, setNotifications] = useState(null);

    return (
        <AppContext.Provider value={{active: !menu, setMenu, pressedKeys, setNotifications}}>
            <Notifications notifications={notifications}/>
            {children}
        </AppContext.Provider>
    )
}

export default Provider