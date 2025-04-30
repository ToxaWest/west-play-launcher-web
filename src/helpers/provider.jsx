import {createContext, useState} from "react";
import Notifications from "../components/Notifications";
import useGamepadButtons from "../hooks/useGamepadButtons";

export const AppContext = createContext({
    notifications: undefined,
    footerActions: {}
});

const Provider = ({children}) => {
    const [notifications, setNotifications] = useState(null);
    const [footerActions, setFooterActions] = useState({});
    useGamepadButtons();
    return (
        <AppContext.Provider value={{setNotifications, footerActions, setFooterActions}}>
            <Notifications notifications={notifications}/>
            {children}
        </AppContext.Provider>
    )
}

export default Provider