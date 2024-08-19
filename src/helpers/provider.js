import {createContext, useState} from "react";
import Notifications from "../components/Notifications";

export const AppContext = createContext({
    notifications: undefined,
});

const Provider = ({children}) => {
    const [notifications, setNotifications] = useState(null);

    return (
        <AppContext.Provider value={{setNotifications}}>
            <Notifications notifications={notifications}/>
            {children}
        </AppContext.Provider>
    )
}

export default Provider