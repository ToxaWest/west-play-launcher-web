import {getFromStorage, setToStorage} from "../helpers/getFromStorage";
import electronConnector from "../helpers/electronConnector";
import useNotification from "./useNotification";
import {useEffect, useState} from "react";
import usePlayTime from "./usePlayTime";

const useStartGame = (game) => {
    const [status, setStatus] = useState('closed');
    const playTime = usePlayTime(game)

    const notification = useNotification();
    const lastPlayed = getFromStorage('lastPlayed');
    const {settings} = getFromStorage('config');

    const getGamePath = () => {
        const list = {
            steam: game.exePath,
            ryujinx: settings.ryujinx,
            rpcs3: settings.rpcs3
        }
        return list[game.source]
    }

    const exePath = getGamePath();

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
            electronConnector.openFile({
                path: exePath,
                parameters: Object.values(game.exeArgs || {}).filter((x) => x),
                imageName: game.imageName
            })
        }
    }

    useEffect(() => {
        electronConnector.gameStatus(_status => {
            if (_status === 'running') {
                playTime.init()
            } else {
                playTime.destroy()
            }
            setStatus(_status)
        })

        return () => {
            playTime.destroy()
        }
    }, []);

    return {
        exePath,
        status,
        start
    }
}

export default useStartGame;