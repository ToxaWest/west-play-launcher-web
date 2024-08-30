import electronConnector from "./electronConnector";
import {getFromStorage, setToStorage} from "./getFromStorage";

const parseAchievement = (game, r) => {
    if (game.achPath.endsWith('achievements.json')) {
        const _earned = JSON.parse(r);
        return Object.entries(_earned).reduce((acc, [key, value]) => {
            if (value.earned) {
                acc[key] = value
            }
            return acc
        }, {})
    }
    if (game.achPath.endsWith('achievements.ini')) {
        const parse = ([name, ...data]) => data.reduce((acc, value) => {
            const [k, v] = value.split('=');
            acc[k] = parseInt(v) || v
            return acc;
        }, {name: name.replace('[', '').replace(']', '')})

        return r.split(`\r\n\r\n`).reduce((acc, a) => {
            if (a) {
                const {name, Achieved, UnlockTime} = parse(a.split(`\r\n`));
                if (name !== 'SteamAchievements') {
                    acc[name] = {
                        earned: Boolean(Achieved),
                        earned_time: UnlockTime
                    }
                }
            }
            return acc;
        }, {})
    }

    return null
}


const getAchievements = (id, update = true, callback) => {
    const game = getFromStorage('games').find(({id: gid}) => gid === parseInt(id));
    const achievements = getFromStorage('achievements');
    const {egs_profile} = getFromStorage('config').settings;

    if (!game.achievements) {
        return;
    }

    if (game.source === 'rpcs3') {
        electronConnector.rpcs3({
            path: game.dataPath
        }).then(data => {
            const _earned = Object.entries(data).reduce((acc, [key, value]) => {
                if (value.earned) {
                    acc[key] = value
                }
                return acc
            }, {})
            if (update) {
                setToStorage('achievements', {...achievements, [game.id]: _earned});
            }
            if (callback) {
                callback(_earned);
            }
        })
        return;
    }

    if (game.source === 'egs' && egs_profile && game.productId) {
        electronConnector.getPlayerProfileAchievementsByProductId({
            epicAccountId: egs_profile,
            productId: game.productId
        }).then(r => {
            if (!r) {
                return
            }
            const _data = r.reduce((acc, {playerAchievement}) => {
                acc[playerAchievement.achievementName] = {
                    earned: playerAchievement.unlocked,
                    earned_time: new Date(playerAchievement.unlockDate).getTime() / 1000
                }
                return acc
            }, {})
            if (update) {
                setToStorage('achievements', {...achievements, [game.id]: _data});
            }
            if (callback) {
                callback(_data);
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