const electronConnector = {
    systemAction: (action) => window.electronAPI.systemAction(action),
    openFile: (data) => window.electronAPI.openFile(data),
    getFile: (data) => window.electronAPI.getFile(data),
    getImage: (data) => window.electronAPI.getImage(data),
    steamgriddbSearch: (data) => window.electronAPI.steamgriddbSearch(data),
    onVisibilityChange: (data) => window.electronAPI.onVisibilityChange(data),
    gameStatus: (data) => window.electronAPI.gameStatus(data),
    crackWatchRequest: (data) => window.electronAPI.crackWatchRequest(data),
    getFreeGames: (data) => window.electronAPI.getFreeGames(data),
    saveImage: (data) => window.electronAPI.saveImage(data),
    openLink: (url) => window.electronAPI.openLink(url),
    watchFile: (data) => window.electronAPI.watchFile(data),
    stopWatch: (data) => window.electronAPI.stopWatch(data),
    fileChanged: (data) => window.electronAPI.fileChanged(data),
    sendNotification: (data) => window.electronAPI.sendNotification(data),
    downloadAudio: (data) => window.electronAPI.downloadAudio(data),
    setBeData: (data) => window.electronAPI.setBeData(data),
    getDataByFolder: (steamGridDbId) => window.electronAPI.getDataByFolder(steamGridDbId),
    gameSearch: ({query, source}) => window.electronAPI.gameSearch({query, source}),
    getUserAchievements: ({data, source}) => window.electronAPI.getUserAchievements({data, source}),
    getGameByID: ({id, source}) => window.electronAPI.getGameByID({id, source})
};

export default electronConnector;