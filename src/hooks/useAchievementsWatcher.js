import {useEffect} from "react";
import {getFromStorage} from "../helpers/getFromStorage";
import electronConnector from "../helpers/electronConnector";
import getAchievements from "../helpers/getAchievements";
import resizeAchievements from "../helpers/resizeAchievements";

const useAchievementsWatcher = (id) => {
    const game = getFromStorage('games').find(g => g.id === id);
    const {achievements} = game;

    const checker = (_ach) => {
        getAchievements(id, true, (latest) => {
            const currentList = Object.keys(_ach);
            const _newList = Object.keys(latest);
            const difference = _newList.filter(x => !currentList.includes(x));
            difference.forEach(k => {
                const {displayName, icon, description} = achievements.find(a => a.name === k.toString());
                resizeAchievements(icon).then(i => {
                    new Notification(displayName, {body: description, icon: i});
                })
            })
        })
    }

    const init = () => {
        if (game.source === 'egs') {
            getAchievements(id, true)
        }
    }

    const watchMap = {
        steam: game.achPath,
        rpcs3: game.dataPath
    }

    useEffect(() => {
        init();

        if (watchMap[game.source]) {
            electronConnector.watchFile(watchMap[game.source])
        }

        electronConnector.fileChanged(() => {
            checker(getFromStorage('achievements')[id])
        })

        return () => {
            if (watchMap[game.source]) {
                electronConnector.stopWatch(watchMap[game.source])
            }
        }
    }, [])

    return {}
}

export default useAchievementsWatcher;