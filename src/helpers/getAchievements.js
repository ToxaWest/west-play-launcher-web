import electronConnector from "./electronConnector";
import {getFromStorage, setToStorage} from "./getFromStorage";

const parseAchievement = (game, r) => {
    if (game.achPath.endsWith('achievements.json')) {
        return JSON.parse(r)
    }
    if (game.achPath.endsWith('achievements.ini')) {
        const result = {};
        game.achievements.forEach(ach => {
            result[ach.name] = {
                earned: false,
                earned_time: 0
            }
        })
        r.split(`\r\n\r\n`)
            .forEach(a => {
                if (a) {
                    const ach = a.split(`\r\n`);
                    if (ach[0] !== '[SteamAchievements]') {
                        result[ach[0].replace('[', '').replace(']', '')] = {
                            earned: true,
                            earned_time: parseInt(ach[4].split('=')[1])
                        }
                    }
                }
            })
        return result;
    }

    return null
}


const getAchievements = (id, update = true, callback) => {
    const game = getFromStorage('games').find(({id: gid}) => gid === parseInt(id));
    const achievements = getFromStorage('achievements');
    const {egs_profile} = getFromStorage('config').settings

    if (game.source === 'rpcs3') {
        electronConnector.rpcs3({
            path: game.dataPath
        }).then(data => {
            if (update) {
                setToStorage('achievements', {...achievements, [game.id]: data});
            }
            if (callback) {
                callback(data);
            }
        })
        return;
    }

    if (game.source === 'egs' && egs_profile && game.productId) {
        electronConnector.getPlayerProfileAchievementsByProductId({
            epicAccountId: egs_profile,
            productId: game.productId
        }).then(r => {
            if(!r){
                return
            }
            const data = {};
            r.forEach(({playerAchievement}) => {
                data[playerAchievement.achievementName] = {
                    earned: playerAchievement.unlocked,
                    earned_time: new Date(playerAchievement.unlockDate).getTime() / 1000
                }
            })
            if (update) {
                setToStorage('achievements', {...achievements, [game.id]: data});
            }
            if (callback) {
                callback(data);
            }
        })
        return;
    }

    if (game.achPath && game.source === 'steam') {
        electronConnector.readFile(game.achPath).then((r) => {
            const data = parseAchievement(game, r);
            if (update) {
                setToStorage('achievements', {...achievements, [game.id]: data});
            }
            if (callback) {
                callback(data);
            }
        })
    }
}


export default getAchievements;