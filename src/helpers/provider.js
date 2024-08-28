import {createContext, useState} from "react";
import Notifications from "../components/Notifications";

export const AppContext = createContext({
    notifications: undefined,
    footerActions: []
});

const Provider = ({children}) => {
    const [notifications, setNotifications] = useState(null);
    const [footerActions, setFooterActions] = useState([]);
    const [prevPath, setPrevPath] = useState(null);

    return (
        <AppContext.Provider value={{setNotifications, footerActions, setFooterActions, prevPath, setPrevPath}}>
            <Notifications notifications={notifications}/>
            {children}
        </AppContext.Provider>
    )
}

export default Provider