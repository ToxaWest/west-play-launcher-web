const apiCall = (props, func) => {
    if (!window.api) {
        return new Promise(() => {
        })
    }
    console.log(`%cAction: ${func}`, 'color: green')
    return window.api[func](props)
}

const electronConnector = {
    getSteamUserId: () => apiCall(null, 'getSteamUserId'),
    getDataByGameId: (props) => apiCall(props, 'getDataByGameId'),
    getGameByFolder: (path) => apiCall(path, 'getGameByFolder'),
    getRyujinxGameData: (props) => apiCall(props, 'getRyujinxGameData'),
    getInstalledSteam: () => apiCall(null, 'getInstalledSteam'),
    getInstalledRyujinx: () => apiCall(null, 'getInstalledRyujinx'),
    getConnectedMonitors: () => apiCall(null, 'getConnectedMonitors'),
    setMainDisplay: (id) => apiCall(id, 'setMainDisplay'),
    getInstalledEGS: () => apiCall(null, 'getInstalledEGS'),
    proxyRequest: (url, options) => apiCall({url, options}, 'proxyRequest'),
    imageProxy: (data) => apiCall(data, 'imageProxy'),
    getSteamAssets: ({steamgriddb, id}) => apiCall({steamgriddb, id}, 'getSteamAssets'),
    clearUnusedCache: (idArray) => apiCall(idArray, 'clearUnusedCache'),
    systemAction: (action) => apiCall(action, 'systemAction'),
    runGame: (data) => apiCall(data, 'runGame'),
    runGameLink: (data) => apiCall(data, 'runGameLink'),
    getImage: (data) => apiCall(data, 'getImage'),
    steamgriddbSearch: (data) => apiCall(data, 'steamgriddbSearch'),
    onVisibilityChange: (data) => apiCall(data, 'onVisibilityChange'),
    gameSearch: (search) => apiCall(search, 'gameSearch'),
    gameStatus: (data) => apiCall(data, 'gameStatus'),
    getSteamId: (data) => apiCall(data, 'getSteamId'),
    receiveSteamId: (data) => apiCall(data, 'receiveSteamId'),
    crackWatchRequest: (data) => apiCall(data, 'crackWatchRequest'),
    getFreeGames: (data) => apiCall(data, 'getFreeGames'),
    saveImage: (data) => apiCall(data, 'saveImage'),
    openLink: (url) => apiCall(url, 'openLink'),
    setBeData: (data) => apiCall(data, 'setBeData'),
    getPlayTime: (games) => apiCall(games, 'getPlayTime'),
    getUserAchievements: ({data, source}) => apiCall({data, source}, 'getUserAchievements'),
    getAchievementsPath: ({path, appid}) => apiCall({path, appid}, 'getAchievementsPath'),
    getFolders: (path) => apiCall(path, 'getFolders'),
    howLongToBeat: (querystring) => apiCall(querystring, 'howLongToBeat'),
    getDisks: () => apiCall(null, 'getDisks'),
    weatherById: (data) => apiCall(data, 'weatherById'),
    weatherSearch: (data) => apiCall(data, 'weatherSearch'),
    CheckVersion: (data) => apiCall(data, 'CheckVersion')
};

export default electronConnector;