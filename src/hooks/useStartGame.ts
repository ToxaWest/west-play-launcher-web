import {useEffect, useState} from "react";
import type {Game} from "@type/game.types";

import electronConnector from "../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../helpers/getFromStorage";

import useNotification from "./useNotification";
import usePlayTime from "./usePlayTime";

const useStartGame = (game: Game) => {
    const [status, setStatus] = useState<"closed" | "running" | "error" | "starting">('closed');
    const notification = useNotification();
    const setPlayTime = usePlayTime(game)
    const lastPlayed = getFromStorage('lastPlayed');

    useEffect(() => {
        electronConnector.checkGameStatus(game.id)
        electronConnector.gameStatus(({status: _status, playTime}) => {
            if (playTime > 0) {
                setPlayTime(playTime)
            }
            if (_status === 'error') {
                notification({
                    description: game.name,
                    img: game.img_icon,
                    name: 'Can\'t start',
                    status: 'error',
                })
            }
            if (_status === 'starting') {
                setToStorage('lastPlayed', {...lastPlayed, [game.id]: new Date().getTime()});
                notification({
                    description: game.name,
                    img: game.img_icon,
                    name: 'Starting...',
                    status: 'success',
                })
            }
            setStatus(_status)
        })
        return () => {
            window.api.removeAllListeners('gameStatus')
        }
    }, []);

    return {
        start: () => electronConnector.startGame(game.id),
        status
    }
}

export default useStartGame;