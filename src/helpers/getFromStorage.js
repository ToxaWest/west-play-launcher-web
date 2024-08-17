function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

function setToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}


export {
    setToStorage,
    getFromStorage
}