const apiCall = (props, func) => {
    if (!window.api) {
        return new Promise(() => {
        })
    }
    console.log(`%cAction: ${func}`, 'color: green')
    return window.api[func](props)
}

const electronConnector = {
    proxyRequest: (url, options) => apiCall({url, options}, 'proxyRequest'),
    getGameByID: (data) => apiCall(data, 'getGameByID'),
    imageProxy: (data) => apiCall(data, 'imageProxy'),
    getSteamAssets: ({steamId}) => apiCall({steamId}, 'getSteamAssets'),
    clearUnusedCache: (idArray) => apiCall(idArray, 'clearUnusedCache'),
    systemAction: (action) => apiCall(action, 'systemAction'),
    runGame: (data) => apiCall(data, 'runGame'),
    runGameLink: (data) => apiCall(data, 'runGameLink'),
    getImage: (data) => apiCall(data, 'getImage'),
    steamgriddbSearch: (data) => apiCall(data, 'steamgriddbSearch'),
    onVisibilityChange: (data) => apiCall(data, 'onVisibilityChange'),
    gameSearch: ({query, source}) => apiCall({query, source}, 'gameSearch'),
    gameStatus: (data) => apiCall(data, 'gameStatus'),
    getSteamId: (data) => apiCall(data, 'getSteamId'),
    receiveSteamId: (data) => apiCall(data, 'receiveSteamId'),
    crackWatchRequest: (data) => apiCall(data, 'crackWatchRequest'),
    getFreeGames: (data) => apiCall(data, 'getFreeGames'),
    saveImage: (data) => apiCall(data, 'saveImage'),
    openLink: (url) => apiCall(url, 'openLink'),
    setBeData: (data) => apiCall(data, 'setBeData'),
    getPlayTime: ({id, source, unofficial}) => apiCall({id, source, unofficial}, 'getPlayTime'),
    updateDataByFolder: ({path, id}) => apiCall({path, id}, 'updateDataByFolder'),
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