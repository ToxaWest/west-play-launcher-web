import {useRef} from "react";
import {getFromStorage} from "../helpers/getFromStorage";
import electronConnector from "../helpers/electronConnector";
import getAchievements from "../helpers/getAchievements";

const useAchievementsWatcher = (id) => {
    const trackTime = 1000
    const game = getFromStorage('games').find(g => g.id === id);
    const {achPath, achievements} = game;
    const currentSession = useRef(0);
    const interval = useRef(null);

    const init = () => {
        if (achPath && achievements) {
            interval.current = setInterval(() => {
                const ach = getFromStorage('achievements')[id];
                electronConnector.lastModify(achPath).then(r => {
                    const modTime = new Date(r).getTime();
                    if (modTime !== currentSession.current) {
                        getAchievements(id, true, (latest) => {
                            const currentList = []
                            Object.entries(ach).forEach(([k, {earned}]) => {
                                if (earned) {
                                    currentList.push(k);
                                }
                            })
                            Object.entries(latest).forEach(([k, {earned}]) => {
                                if (earned && (currentList.indexOf(k) === -1)) {
                                    const {displayName, icon, description} = achievements.find(a => a.name === k);
                                    new Notification(displayName, {
                                        body: description,
                                        icon
                                    });

                                }
                            })
                            currentSession.current = modTime;
                        })
                    }
                })
            }, trackTime)
        }
    }

    const destroy = () => {
        if (interval.current) {
            clearInterval(interval.current);
        }
    }

    return {
        init,
        destroy
    }
}

export default useAchievementsWatcher;