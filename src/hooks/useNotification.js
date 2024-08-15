import {useContext} from "react";
import {AppContext} from "../helpers/provider";

const useNotification = () => {
    const {setNotifications} = useContext(AppContext);
    return (notification, delay = 4000) => {
        setNotifications(notification)
        setTimeout(() => {
            setNotifications(null)
        }, delay)
    }
}

export default useNotification;