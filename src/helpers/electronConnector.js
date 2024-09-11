const electronConnector = {
    systemAction: (action) => window.api.systemAction(action),
    openFile: (data) => window.api.openFile(data),
    getFile: (data) => window.api.getFile(data),
    getImage: (data) => window.api.getImage(data),
    steamgriddbSearch: (data) => window.api.steamgriddbSearch(data),
    onVisibilityChange: (data) => window.api.onVisibilityChange(data),
    gameStatus: (data) => window.api.gameStatus(data),
    crackWatchRequest: (data) => window.api.crackWatchRequest(data),
    getFreeGames: (data) => window.api.getFreeGames(data),
    saveImage: (data) => window.api.saveImage(data),
    openLink: (url) => window.api.openLink(url),
    watchFile: (data) => window.api.watchFile(data),
    stopWatch: (data) => window.api.stopWatch(data),
    fileChanged: (data) => window.api.fileChanged(data),
    sendNotification: (data) => window.api.sendNotification(data),
    downloadAudio: (data) => window.api.downloadAudio(data),
    setBeData: (data) => window.api.setBeData(data),
    getDataByFolder: (steamGridDbId) => window.api.getDataByFolder(steamGridDbId),
    getPlayTime: ({id, source}) => window.api.getPlayTime({id, source}),
    updateDataByFolder: ({path, id}) => window.api.updateDataByFolder({path, id}),
    gameSearch: ({query, source}) => window.api.gameSearch({query, source}),
    getUserAchievements: ({data, source}) => window.api.getUserAchievements({data, source}),
    getGameByID: ({id, source}) => window.api.getGameByID({id, source}),
    getAchievementsPath: ({path, appid}) => window.api.getAchievementsPath({path, appid})
};

export default electronConnector;