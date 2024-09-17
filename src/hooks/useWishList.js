import {useState} from "react";
import {getFromStorage, setToStorage} from "../helpers/getFromStorage";

const useWishList = () => {
    const [games, setGames] = useState(getFromStorage('wishList'));

    const update = (game) => {
        setGames((g) => {
            const index = games.findIndex(_game => _game.id === game.id);
            if(index === -1) {
                const res = [game, ...g];
                setToStorage('wishList', res)
                return res;
            } else {
                const res = g.filter(_game => _game.id !== game.id);
                setToStorage('wishList', res)
                return res;
            }
        })
    }

    const inList = (g) => {
        return games.findIndex(_game => _game.id === g.id) !== -1;
    }

    return {
        games,
        inList,
        update
    }
}
export default useWishList