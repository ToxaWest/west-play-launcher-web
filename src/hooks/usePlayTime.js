import {getFromStorage, setToStorage} from "../helpers/getFromStorage";
import {useEffect, useRef, useState} from "react";
import useNotification from "./useNotification";

const usePlayTime = (id, img, name) => {
    const trackTime = 10000
    const [active, setActive] = useState(false);
    const currentSession = useRef(0)
    const interval = useRef(null);
    const notification = useNotification();

    useEffect(() => {
        if (active) {
            interval.current = setInterval(() => {
                const current = getFromStorage('playTime');
                setToStorage('playTime', {...current, [id]: current[id] + trackTime});
                currentSession.current = currentSession.current + trackTime
            }, trackTime)
        } else {
            clearInterval(interval.current);
            if (currentSession.current) {
                notification({
                    img,
                    description: 'You played ' + secondsToHms(currentSession.current),
                    name,
                    status: 'warning'
                }, 8000)
                currentSession.current = 0
            }
        }
    }, [active]);

    return {
        updateStatus: (status) => {
            if (status === 'closed') {
                setActive(false)
            } else {
                setActive(true)
            }
        }
    }
}

function secondsToHms(d) {
    d = Number(d / 1000);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + 'h' : "";
    var mDisplay = m > 0 ? m + 'm' : "";
    var sDisplay = s > 0 ? s + 's' : "";
    return hDisplay + mDisplay + sDisplay;
    // return hDisplay + mDisplay;
}

export {
    secondsToHms
}

export default usePlayTime;