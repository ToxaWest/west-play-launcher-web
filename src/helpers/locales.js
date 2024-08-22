import {getFromStorage} from "./getFromStorage";

export const locales = [
    {"label": "Arabic", value: "arabic", "webapi": "ar", "native": "العربية"},
    {"label": "Bulgarian", value: "bulgarian", "webapi": "bg", "native": "български език"},
    {"label": "Czech", value: "czech", "webapi": "cs", "native": "čeština"},
    {"label": "Danish", value: "danish", "webapi": "da", "native": "Dansk"},
    {"label": "Dutch", value: "dutch", "webapi": "nl", "native": "Nederlands"},
    {"label": "English", value: "english", "webapi": "en", "native": "English"},
    {"label": "Finnish", value: "finnish", "webapi": "fi", "native": "Suomi"},
    {"label": "French", value: "french", "webapi": "fr", "native": "Français"},
    {"label": "German", value: "german", "webapi": "de", "native": "Deutsch"},
    {"label": "Greek", value: "greek", "webapi": "el", "native": "Ελληνικά"},
    {"label": "Hungarian", value: "hungarian", "webapi": "hu", "native": "Magyar"},
    {"label": "Italian", value: "italian", "webapi": "it", "native": "Italiano"},
    {"label": "Japanese", value: "japanese", "webapi": "ja", "native": "日本語"},
    {"label": "Korean", value: "koreana", "webapi": "ko", "native": "한국어"},
    {"label": "Norwegian", value: "norwegian", "webapi": "no", "native": "Norsk"},
    {"label": "Polish", value: "polish", "webapi": "pl", "native": "Polski"},
    {"label": "Portuguese", value: "portuguese", "webapi": "pt", "native": "Português"},
    {"label": "Romanian", value: "romanian", "webapi": "ro", "native": "Română"},
    {"label": "Terrorist (ex russian)", value: "russian", "webapi": "ru", "native": "Русский"},
    {"label": "Spanish", value: "spanish", "webapi": "es", "native": "Español-España"},
    {"label": "Swedish", value: "swedish", "webapi": "sv", "native": "Svenska"},
    {"label": "Thai", value: "thai", "webapi": "th", "native": "ไทย"},
    {"label": "Turkish", value: "turkish", "webapi": "tr", "native": "Türkçe"},
    {"label": "Ukrainian", value: "ukrainian", "webapi": "uk", "native": "Українська"},
    {"label": "Vietnamese", value: "vietnamese", "webapi": "vn", "native": "Tiếng Việt"}
]

export const currentLang = () => getFromStorage('config').settings.currentLang || "en";