import {getFromStorage, setToStorage} from "../helpers/getFromStorage";
import electronConnector from "../helpers/electronConnector";
import useNotification from "./useNotification";
import {useEffect, useState} from "react";
import usePlayTime from "./usePlayTime";

const useStartGame = (game) => {
    const [status, setStatus] = useState('closed');
    const setPlayTime = usePlayTime(game)
    const notification = useNotification();
    const lastPlayed = getFromStorage('lastPlayed');

    useEffect(() => {
        electronConnector.checkGameStatus(game.id)
        electronConnector.gameStatus(({status: _status, playTime}) => {
            if (playTime > 0) {
                setPlayTime(playTime)
            }
            if (_status === 'error') {
                notification({
                    status: 'error',
                    img: game.img_icon,
                    name: 'Can\'t start',
                    description: game.name,
                })
            }
            if (_status === 'starting') {
                setToStorage('lastPlayed', {...lastPlayed, [game.id]: new Date().getTime()});
                notification({
                    status: 'success',
                    img: game.img_icon,
                    name: 'Starting...',
                    description: game.name,
                })
            }
            setStatus(_status)
        })
        return () => {
            window.api.removeAllListeners('gameStatus')
        }
    }, []);

    return {
        status,
        start: () => electronConnector.startGame(game.id)
    }
}

export default useStartGame;