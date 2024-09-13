import {useEffect} from "react";
import {getFromStorage} from "../helpers/getFromStorage";
import electronConnector from "../helpers/electronConnector";
import getAchievements from "../helpers/getAchievements";

const useAchievementsWatcher = (id) => {
    const game = getFromStorage('games').find(g => g.id === id);
    const {achievements} = game;

    const checker = () => {
        const _ach = getFromStorage('achievements')[id]
        getAchievements(id, true, (latest) => {
            const currentList = Object.keys(_ach);
            const _newList = Object.keys(latest);
            const difference = _newList.filter(x => !currentList.includes(x));
            difference.forEach(k => {
                const {displayName, icon, description} = achievements.find(a => a.name === k.toString());
                electronConnector.sendNotification({
                    title: displayName,
                    body: description,
                    icon: icon
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
        rpcs3: game.achPath
    }

    useEffect(() => {
        init();

        if (watchMap[game.source]) {
            electronConnector.watchFile(watchMap[game.source])
            electronConnector.fileChanged(checker)
        }

        return () => {
            if (watchMap[game.source]) {
                electronConnector.stopWatch(watchMap[game.source])
            }
            window.api.removeAllListeners('fileChanged')
        }
    }, [])

    return {}
}

export default useAchievementsWatcher;