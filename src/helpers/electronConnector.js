const electronConnector = {
    toggleOverlay: (d) => window.electronAPI.toggleOverlay(d),
    onVisibilityChange: (data) => window.electronAPI.onVisibilityChange(data),
    nintendoSearch: (data) => window.electronAPI.nintendoSearch(data),
    nintendoReq: (data) => window.electronAPI.nintendoReq(data),
    closeFile: (data) => window.electronAPI.closeFile(data),
    openFile: (data) => window.electronAPI.openFile(data),
    getFile: (data) => window.electronAPI.getFile(data),
    getImage: (data) => window.electronAPI.getImage(data),
    getSteamData: (data) => window.electronAPI.getSteamData(data),
    getFolder: (data) => window.electronAPI.getFolder(data),
    steamSearch: (data) => window.electronAPI.steamSearch(data),
    steamgriddbSearch: (data) => window.electronAPI.steamgriddbSearch(data)
};

export default electronConnector;