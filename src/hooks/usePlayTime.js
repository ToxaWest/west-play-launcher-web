import {getFromStorage, setToStorage} from "../helpers/getFromStorage";
import {useRef} from "react";
import useNotification from "./useNotification";

const usePlayTime = ({id, img_icon: img, name}) => {
    const trackTime = 5000
    const currentSession = useRef(0)
    const notification = useNotification();
    const interval = useRef(null)

    const destroy = () => {
        if (interval.current) {
            clearInterval(interval.current);
            notification({
                img,
                description: 'You played ' + secondsToHms(currentSession.current),
                name,
                status: 'warning'
            }, 8000)
            currentSession.current = 0
        }
    }

    const init = () => {
        interval.current = setInterval(() => {
            const current = getFromStorage('playTime');
            setToStorage('playTime', {...current, [id]: (current[id] || 0) + trackTime});
            currentSession.current = currentSession.current + trackTime;
        }, trackTime)
    }

    return {
        destroy,
        init
    }
}

function secondsToHms(d) {
    d = Number(d / 1000);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + 'h ' : "";
    var mDisplay = m > 0 ? m + 'm ' : "";
    var sDisplay = s > 0 ? s + 's' : "";
    return hDisplay + mDisplay + sDisplay;
}

export {
    secondsToHms
}

export default usePlayTime;