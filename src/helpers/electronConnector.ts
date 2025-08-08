import {
    ConnectedMonitorType,
    FileManagerFolderType,
    getAjaxVideo, getAjaxVideoInput, getDataByGameIdInput,
    getImageAssets,
    getImageInput, getPageData,
    getSerialData, getSteamAssetsOutput,
    getSteamUserId, HLTBSearchResponse,
    movieSearch, steamGridDbSearchResponse,
    SteamSearchResponse
} from "@type/electron.types";
import type {EarnedAchievementsType, Game, ProgressType, StatsType} from "@type/game.types";
import {MovieStorageHistory} from "@type/movieStorage.types";

const electronNotWorking = {
    getAlarm: [],
    getMoviesHistory: [],
    getPageData: null,
    getPlayTime: {},
    getWindowsBG: null,
    weatherById: {
        main: {temp: 0},
        weather: [{icon: null}]
    },
}

const apiCall = (props: any, func: string) => {
    if (typeof props === 'function') {
        console.log(`%cListening: ${func}`, 'color: teal')
    } else {
        console.log(`%cAction: ${func}`, 'color: lime')
    }
    try {
        return window.api[func](props)
    } catch (e) {
        console.error(e)
        return new Promise(() => {
            if (!Object.hasOwn(electronNotWorking, func)) console.error(func)
            return electronNotWorking[func]
        })
    }
}

const electronConnector = {
    CheckVersion: (url: string): Promise<string | null> => apiCall(url, 'CheckVersion'),
    beProxy: <T>({url, options, type}: {
        url: string,
        options?: RequestInit,
        type: string
    }): Promise<T> => apiCall({options, type, url}, 'beProxy'),
    checkGameStatus: (id: string | number): void => apiCall(id, 'checkGameStatus'),
    clearUnusedCache: (idArray: (string | number)[]): Promise<{
        removed: number
    }> => apiCall(idArray, 'clearUnusedCache'),
    gameSearch: (query: string): Promise<SteamSearchResponse[]> => apiCall(query, 'gameSearch'),
    gameStatus: (callBack: ({status, playTime}: {
        gameId: string | number,
        status: 'closed' | 'running' | 'error' | 'starting',
        playTime: number
    }) => void): void => apiCall(callBack, 'gameStatus'),
    generateSteamSettings: (data: {
        gamePath: string, copyDll: boolean, options?: {
            disableDlc?: boolean,
        }
    }): Promise<{
        error: boolean,
        message: string,
        data?: { achFile: string }
    }> => apiCall(data, 'generateSteamSettings'),
    getAchievementScreenshots: (gameName: string): Promise<{
        path: string,
        name: string
    }[]> => apiCall(gameName, 'getAchievementScreenshots'),
    getAchievementsPath: ({appid}: {
        appid: number
    }): Promise<string | null> => apiCall({appid}, 'getAchievementsPath'),
    getAjaxVideo: (props: getAjaxVideoInput): Promise<getAjaxVideo> => apiCall(props, 'getAjaxVideo'),
    getAlarm: () => apiCall(null, 'getAlarm'),
    getAlarmRegionList: (): Promise<{ value: string, label: string }[]> => apiCall(null, 'getAlarmRegionList'),
    getConnectedMonitors: (): Promise<ConnectedMonitorType[]> => apiCall(null, 'getConnectedMonitors'),
    getDataByGameId: (props: getDataByGameIdInput): Promise<Game> => apiCall(props, 'getDataByGameId'),
    getDisks: (): Promise<string[]> => apiCall(null, 'getDisks'),
    getFolders: (path: string): Promise<FileManagerFolderType[]> => apiCall(path, 'getFolders'),
    getGameByFolder: (path: string) => apiCall(path, 'getGameByFolder'),
    getImage: (data: { body: getImageInput }): Promise<{
        data: { assets: getImageAssets[] }
    }> => apiCall(data, 'getImage'),
    getInstalledGames: (): Promise<Game[]> => apiCall(null, 'getInstalledGames'),
    getMoviesHistory: (): Promise<MovieStorageHistory[]> => apiCall(null, 'getMoviesHistory'),
    getPageData: (url: string): Promise<getPageData> => apiCall(url, 'getPageData'),
    getPlayTime: (): Promise<{
        [key: string | number]: { playTime: number, lastPlayed: number }
    }> => apiCall(null, 'getPlayTime'),
    getSerialData: (url: string): Promise<getSerialData> => apiCall(url, 'getSerialData'),
    getSteamAssets: ({steamgriddb, id}: {
        steamgriddb: string,
        id: string | number
    }): Promise<getSteamAssetsOutput> => apiCall({id, steamgriddb}, 'getSteamAssets'),
    getSteamId: (listener: ({searchParams}) => void): void => apiCall(listener, 'getSteamId'),
    getSteamUserId: (): Promise<getSteamUserId[]> => apiCall(null, 'getSteamUserId'),
    getUserAchievements: (game: {
        achPath: string;
        productId: string;
        unofficial: boolean;
        steamId: number;
        source: "steam" | "egs" | "ryujinx" | "gog"
    }): Promise<{
        achievements: EarnedAchievementsType | null
        stats: StatsType | null
        progress: ProgressType | null
    }> => apiCall(game, 'getUserAchievements'),
    getWindowsBG: (): Promise<string> => apiCall(null, 'getWindowsBG'),
    howLongToBeat: (query: string): Promise<HLTBSearchResponse[]> => apiCall(query, 'howLongToBeat'),
    imageProxy: (url: string): Promise<BlobPart[]> => apiCall(url, 'imageProxy'),
    movieLogin: (login: {
        login_name: string,
        login_not_save: number,
        login_password: string
    }): Promise<string | null> => apiCall(login, 'movieLogin'),
    movieSearch: (query: string): Promise<movieSearch[]> => apiCall(query, 'movieSearch'),
    onVisibilityChange: (callBack: (visible: boolean) => void): void => apiCall(callBack, 'onVisibilityChange'),
    openLink: (url: string): void => apiCall(url, 'openLink'),
    receiveSteamId: (id: number): void => apiCall(id, 'receiveSteamId'),
    saveImage: (data: {
        url: string,
        type: string,
        id: string | number,
    }): Promise<string> => apiCall(data, 'saveImage'),
    setAppModel: ({id, icon, name}): Promise<void> => apiCall({icon, id, name}, 'setAppModel'),
    setMainDisplay: (id: string): Promise<void> => apiCall(id, 'setMainDisplay'),
    setSave: (data: {
        post_id: number,
        translator_id: number,
        season: number,
        episode: number,
    }): Promise<void> => apiCall(data, 'setSave'),
    startGame: (id: string | number): void => apiCall(id, 'startGame'),
    steamgriddbSearch: (props: { params: string }): Promise<{
        data: steamGridDbSearchResponse[]
    }> => apiCall(props, 'steamgriddbSearch'),
    systemAction: (action: string): void => apiCall(action, 'systemAction'),
    weatherById: (id: number): Promise<any> => apiCall(id, 'weatherById'),
    weatherSearch: (query: string): Promise<{
        name: string
        id: number
        sys: {
            country: string
        }
    }[]> => apiCall(query, 'weatherSearch')
};

export default electronConnector;