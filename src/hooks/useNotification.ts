import {use} from "react";

import {AppContext} from "../helpers/provider";
import type {notificationsType} from "../types/provider.types";

const useNotification = () => {
    const {setNotifications} = use(AppContext);
    return (notification: notificationsType, delay = 4000) => {
        setNotifications(notification)
        setTimeout(() => {
            setNotifications(null)
        }, delay)
    }
}

export default useNotification;