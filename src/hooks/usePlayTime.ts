import useNotification from "@hook/useNotification";
import type {Game} from "@type/game.types";

import {getFromStorage, setToStorage} from "../helpers/getFromStorage";
import i18n from "../helpers/translate";

const usePlayTime = ({id, img_icon: img, name}: Game) => {
    const notification = useNotification();
    return (time: number) => {
        const current = getFromStorage('playTime');
        setToStorage('playTime', {...current, [id]: (current[id] || 0) + time});
        notification({
            description: i18n.t('You played ') + secondsToHms(time),
            img,
            name,
            status: 'warning'
        }, 9000)
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