import type {LocalStorageKeys, LocalStorageType} from "@type/localStorage.type";

function getFromStorage< K extends LocalStorageKeys>(key: K): LocalStorageType[K] {
    if(!localStorage.getItem(key)) return {}
    return JSON.parse(localStorage.getItem(key))
}

function setToStorage< K extends LocalStorageKeys>(key: K, value: LocalStorageType[K]): void {
    localStorage.setItem(key, JSON.stringify(value))
}


export {
    setToStorage,
    getFromStorage
}