const electronConnector = {
    nintendoSearch: (data) => window.electronAPI.nintendoSearch(data),
    nintendoReq: (data) => window.electronAPI.nintendoReq(data),
    openFile: (data) => window.electronAPI.openFile(data),
    getFile: (data) => window.electronAPI.getFile(data),
    getEgsId: (d) => window.electronAPI.getEgsId(d),
    getImage: (data) => window.electronAPI.getImage(data),
    getSteamData: (data) => window.electronAPI.getSteamData(data),
    getFolder: (data) => window.electronAPI.getFolder(data),
    steamSearch: (data) => window.electronAPI.steamSearch(data),
    steamgriddbSearch: (data) => window.electronAPI.steamgriddbSearch(data),
    getSteamAchievements: (data) => window.electronAPI.getSteamAchievements(data),
    readFile: (data) => window.electronAPI.readFile(data),
    onVisibilityChange: (data) => window.electronAPI.onVisibilityChange(data),
    gameStatus: (data) => window.electronAPI.gameStatus(data),
    changeDisplayMode: (data) => window.electronAPI.changeDisplayMode(data),
    lastModify: (data) => window.electronAPI.lastModify(data),
    shutDownPC: () => window.electronAPI.shutDownPC(),
    restartPC: () => window.electronAPI.restartPC(),
    rpcs3: (data) => window.electronAPI.rpcs3(data),
    getGamesRPCS3: (data) => window.electronAPI.getGamesRPCS3(data),
    lastCrackedGames: () => window.electronAPI.lastCrackedGames(),
    nintendoData: (url) => window.electronAPI.nintendoData(url)
};

export default electronConnector;