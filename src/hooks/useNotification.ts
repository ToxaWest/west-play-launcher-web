import {use} from "react";
import type {notificationsType} from "@type/provider.types";

import {AppContext} from "../helpers/provider";

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