import type {EarnedAchievementsType} from "../types/game.types";

import electronConnector from "./electronConnector";
import {getFromStorage, setToStorage} from "./getFromStorage";

const getAchievements = (
    id: string,
    callback: (value: EarnedAchievementsType | null) => void
) => {
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const achievements = getFromStorage('achievements');
    const stats = getFromStorage('stats') || {};
    const progress = getFromStorage('progress') || {};
    if (!game?.achievements) {
        callback(null)
        return;
    }

    if (game.source === 'steam' && !game.achPath && game.steamId && game.unofficial) {
        electronConnector.getAchievementsPath({appid: game.steamId}).then((achPath) => {
            if (achPath) {
                const games = getFromStorage('games')
                const index = games.findIndex(({id: gid}) => gid.toString() === id);
                games[index].achPath = achPath;
                setToStorage('games', games);
                window.location.reload()
            }
        });
    } else {
        electronConnector.getUserAchievements({
            achPath: game.achPath,
            productId: game.productId,
            source: game.source,
            steamId: game.steamId,
            unofficial: game.unofficial,
        }).then(({achievements: r_ach, stats: r_stats, progress: r_progress}) => {
            setToStorage('stats', {...stats, [game.id]: r_stats});
            setToStorage('progress', {...progress, [game.id]: r_progress});
            if (!r_ach) {
                callback(null);
                return;
            }
            setToStorage('achievements', {...achievements, [game.id]: r_ach});
            callback(r_ach);
        })
    }
}


export default getAchievements;