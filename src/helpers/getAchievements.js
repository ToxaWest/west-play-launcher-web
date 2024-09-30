import electronConnector from "./electronConnector";
import {getFromStorage, setToStorage} from "./getFromStorage";

const getAchievements = (id, callback) => {
    const game = getFromStorage('games').find(({id: gid}) => gid === parseInt(id));
    const achievements = getFromStorage('achievements');

    if (!game.achievements) {
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
            data: {achPath: game.achPath, productId: game.productId, unofficial: game.unofficial, steamId: game.steamId},
            source: game.source,
        }).then(_data => {
            if (!_data) {
                callback(null);
                return;
            }
            setToStorage('achievements', {...achievements, [game.id]: _data});
            callback(_data);
        })
    }
}


export default getAchievements;