const apiCall = (props, func) => {
    if (!window.api) {
        return () => {
        }
    }
    console.log(`%caction: ${func}`, 'color: green')

    return window.api[func](props)
}

const electronConnector = {
    getSteamAssets: ({steamId, steamgriddb}) => apiCall({steamId, steamgriddb}, 'getSteamAssets'),
    clearUnusedCache: (idArray) => apiCall(idArray, 'clearUnusedCache'),
    systemAction: (action) => apiCall(action, 'systemAction'),
    runGame: (data) => apiCall(data, 'runGame'),
    runGameLink: (data) => apiCall(data, 'runGameLink'),
    getFile: (data) => apiCall(data, 'getFile'),
    getImage: (data) => apiCall(data, 'getImage'),
    steamgriddbSearch: (data) => apiCall(data, 'steamgriddbSearch'),
    onVisibilityChange: (data) => apiCall(data, 'onVisibilityChange'),
    gameStatus: (data) => apiCall(data, 'gameStatus'),
    crackWatchRequest: (data) => apiCall(data, 'crackWatchRequest'),
    getFreeGames: (data) => apiCall(data, 'getFreeGames'),
    saveImage: (data) => apiCall(data, 'saveImage'),
    openLink: (url) => apiCall(url, 'openLink'),
    watchFile: (data) => apiCall(data, 'watchFile'),
    stopWatch: (data) => apiCall(data, 'stopWatch'),
    fileChanged: (data) => apiCall(data, 'fileChanged'),
    sendNotification: (data) => apiCall(data, 'sendNotification'),
    downloadAudio: (data) => apiCall(data, 'downloadAudio'),
    setBeData: (data) => apiCall(data, 'setBeData'),
    getDataByFolder: (steamGridDbId) => apiCall(steamGridDbId, 'getDataByFolder'),
    getPlayTime: ({id, source}) => apiCall({id, source}, 'getPlayTime'),
    updateDataByFolder: ({path, id}) => apiCall({path, id}, 'updateDataByFolder'),
    gameSearch: ({query, source}) => apiCall({query, source}, 'gameSearch'),
    getUserAchievements: ({data, source}) => apiCall({data, source}, 'getUserAchievements'),
    getGameByID: ({id, source}) => apiCall({id, source}, 'getGameByID'),
    getAchievementsPath: ({path, appid}) => apiCall({path, appid}, 'getAchievementsPath')
};

export default electronConnector;