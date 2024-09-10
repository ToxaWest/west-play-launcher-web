import electronConnector from "./electronConnector";
import {getFromStorage, setToStorage} from "./getFromStorage";

const getAchievements = (id, update = true, callback) => {
    const game = getFromStorage('games').find(({id: gid}) => gid === parseInt(id));
    const achievements = getFromStorage('achievements');

    if (!game.achievements) {
        return;
    }

    electronConnector.getUserAchievements({
        data: {
            achPath: game.achPath,
            productId: game.productId
        },
        source: game.source,
    }).then(_data => {
        if (!_data) {
            return;
        }
        if (update) {
            setToStorage('achievements', {...achievements, [game.id]: _data});
        }
        if (callback) {
            callback(_data);
        }
    })
}


export default getAchievements;