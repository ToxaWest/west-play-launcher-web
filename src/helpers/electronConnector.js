const electronConnector = {
    nintendoSearch: (data) => window.electronAPI.nintendoSearch(data),
    nintendoReq: (data) => window.electronAPI.nintendoReq(data),
    openFile: (data) => window.electronAPI.openFile(data),
    getFile: (data) => window.electronAPI.getFile(data),
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
    lastModify: (data) => window.electronAPI.lastModify(data)
};

export default electronConnector;