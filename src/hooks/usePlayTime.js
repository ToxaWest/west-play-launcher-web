import {getFromStorage, setToStorage} from "../helpers/getFromStorage";
import useNotification from "./useNotification";

const usePlayTime = ({id, img_icon: img, name}) => {
    const notification = useNotification();
    return (time) => {
        const current = getFromStorage('playTime');
        setToStorage('playTime', {...current, [id]: (current[id] || 0) + time});
        notification({
            img,
            description: 'You played ' + secondsToHms(time),
            name,
            status: 'warning'
        }, 8000)
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