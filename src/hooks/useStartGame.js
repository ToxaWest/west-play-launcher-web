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
    const {settings} = getFromStorage('config');

    const getGamePath = () => {
        const list = {
            steam: game.exePath,
            ryujinx: settings.ryujinx,
            rpcs3: settings.rpcs3,
            egs: game.exePath,
            gog: game.exePath,
            origin: game.exePath,
        }
        return list[game.source]
    }

    const exePath = getGamePath();

    const getLinkUrl = () => {
        if(exePath.includes('://')) return exePath;

        return null;
    }

    const start = () => {
        setToStorage('lastPlayed', {...lastPlayed, [game.id]: new Date().getTime()});
        notification({
            status: exePath ? 'success' : 'error',
            img: game.img_icon,
            name: exePath ? 'Starting...' : 'Can\'t start',
            description: game.name,
        })
        if (exePath) {
            setStatus('starting')
            const link = getLinkUrl();
            if (link) {
                electronConnector.runGameLink({
                    path: exePath,
                    imageName: game.imageName,
                    id: game.id
                })
            } else {
                electronConnector.runGame({
                    path: exePath,
                    parameters: Object.values(game.exeArgs || {}).filter((x) => x),
                    imageName: game.imageName,
                    id: game.id
                })
            }
        }
    }

    useEffect(() => {
        electronConnector.gameStatus(({status: _status, playTime}) => {
            if (playTime > 0) {
                setPlayTime(playTime)
            }
            setStatus(_status)
        })

        return () => {
            window.api.removeAllListeners('gameStatus')
        }
    }, []);

    return {
        exePath,
        status,
        start
    }
}

export default useStartGame;