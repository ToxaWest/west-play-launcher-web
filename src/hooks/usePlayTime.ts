import {getFromStorage, setToStorage} from "../helpers/getFromStorage";
import type {Game} from "../types/game.types";

import useNotification from "./useNotification";

const usePlayTime = ({id, img_icon: img, name}: Game) => {
    const notification = useNotification();
    return (time: number) => {
        const current = getFromStorage('playTime');
        setToStorage('playTime', {...current, [id]: (current[id] || 0) + time});
        notification({
            description: 'You played ' + secondsToHms(time),
            img,
            name,
            status: 'warning'
        }, 8000)
    }
}

function secondsToHms(d: number): string {
    d = Number(d / 1000);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);

    const hDisplay = h > 0 ? h + 'h ' : "";
    const mDisplay = m > 0 ? m + 'm ' : "";
    return hDisplay + mDisplay;
}

export {
    secondsToHms
}

export default usePlayTime;