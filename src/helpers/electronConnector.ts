import type {
    getAjaxVideo,
    getAjaxVideoInput, getDataByGameId, getDataByGameIdInput,
    getPageData,
    getSerialData,
    getSteamUserId,
    movieSearch
} from "../types/electron.types";

const apiCall = (props, func: string) => {
    console.log(`%cAction: ${func}`, 'color: green')
    // @ts-ignore
    return window.api[func](props)
}

const electronConnector = {
    openKeyboard: (): void => apiCall(null, 'openKeyboard'),
    movieSearch: (query: string): Promise<movieSearch[]> => apiCall(query, 'movieSearch'),
    getPageData: (url: string): Promise<getPageData> => apiCall(url, 'getPageData'),
    getAjaxVideo: (props: getAjaxVideoInput): Promise<getAjaxVideo> => apiCall(props, 'getAjaxVideo'),
    getSerialData: (url: string): Promise<getSerialData> => apiCall(url, 'getSerialData'),
    getSteamUserId: (): Promise<getSteamUserId[]> => apiCall(null, 'getSteamUserId'),
    getDataByGameId: (props: getDataByGameIdInput): Promise<getDataByGameId> => apiCall(props, 'getDataByGameId'),
    getGameByFolder: (path: string) => apiCall(path, 'getGameByFolder'),
    getRyujinxGameData: (props) => apiCall(props, 'getRyujinxGameData'),
    getInstalledSteam: () => apiCall(null, 'getInstalledSteam'),
    getInstalledRyujinx: () => apiCall(null, 'getInstalledRyujinx'),
    getConnectedMonitors: () => apiCall(null, 'getConnectedMonitors'),
    setMainDisplay: (id: string): void => apiCall(id, 'setMainDisplay'),
    getInstalledEGS: () => apiCall(null, 'getInstalledEGS'),
    proxyRequest: (url, options) => apiCall({url, options}, 'proxyRequest'),
    imageProxy: (data) => apiCall(data, 'imageProxy'),
    getSteamAssets: ({steamgriddb, id}) => apiCall({steamgriddb, id}, 'getSteamAssets'),
    clearUnusedCache: (idArray) => apiCall(idArray, 'clearUnusedCache'),
    systemAction: (action: string): void => apiCall(action, 'systemAction'),
    runGame: (props: {
        path: string
        imageName?: string
        parameters: string[]
        id: string | number
    }): void => apiCall(props, 'runGame'),
    runGameLink: (props: {
        path: string
        imageName?: string
        id: string | number
    }): void => apiCall(props, 'runGameLink'),
    getImage: (data) => apiCall(data, 'getImage'),
    steamgriddbSearch: (props: { params: string }): Promise<any[]> => apiCall(props, 'steamgriddbSearch'),
    onVisibilityChange: (callBack: (visible: boolean) => void): void => apiCall(callBack, 'onVisibilityChange'),
    gameSearch: (query: string) => apiCall(query, 'gameSearch'),
    gameStatus: (callBack: ({status, playTime}: {
        status: 'closed' | 'running',
        playTime: number
    }) => void): void => apiCall(callBack, 'gameStatus'),
    getSteamId: (data) => apiCall(data, 'getSteamId'),
    receiveSteamId: (id: string | null): void => apiCall(id, 'receiveSteamId'),
    crackWatchRequest: (): Promise<{ games: any[] }> => apiCall(null, 'crackWatchRequest'),
    getFreeGames: (): Promise<any[]> => apiCall(null, 'getFreeGames'),
    saveImage: (data) => apiCall(data, 'saveImage'),
    openLink: (url: string): void => apiCall(url, 'openLink'),
    setBeData: (data) => apiCall(data, 'setBeData'),
    getPlayTime: (games) => apiCall(games, 'getPlayTime'),
    getUserAchievements: ({data, source}) => apiCall({data, source}, 'getUserAchievements'),
    getAchievementsPath: ({path, appid}) => apiCall({path, appid}, 'getAchievementsPath'),
    getFolders: (path: string) => apiCall(path, 'getFolders'),
    howLongToBeat: (query: string) => apiCall(query, 'howLongToBeat'),
    getDisks: (): Promise<string[]> => apiCall(null, 'getDisks'),
    weatherById: (id: number): Promise<any> => apiCall(id, 'weatherById'),
    weatherSearch: (query: string): Promise<{
        name: string
        id: number
        sys: {
            country: string
        }
    }[]> => apiCall(query, 'weatherSearch'),
    CheckVersion: (url: string): Promise<string | null> => apiCall(url, 'CheckVersion')
};

export default electronConnector;