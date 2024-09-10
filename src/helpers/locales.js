import {getFromStorage} from "./getFromStorage";

export const locales = [
    {"label": "English", value: "english", "webapi": "en", "native": "English"},
    {"label": "French", value: "french", "webapi": "fr", "native": "Français"},
    {"label": "German", value: "german", "webapi": "de", "native": "Deutsch"},
    {"label": "Polish", value: "polish", "webapi": "pl", "native": "Polski"},
    {"label": "Terrorist (ex russian)", value: "russian", "webapi": "ru", "native": "Русский"},
    {"label": "Ukrainian", value: "ukrainian", "webapi": "uk", "native": "Українська"},
]

export const currentLang = () => getFromStorage('config').settings.currentLang || "en";