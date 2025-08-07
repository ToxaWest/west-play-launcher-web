import type {LocalStorageType} from "@type/localStorage.type";

export default function initLocalStorage() {
    const storage: LocalStorageType = {
        achievements: {},
        config: {
            settings: {
                currentLang: 'english',
                gamesInRow: 6,
                ryujinx: '',
                showCrackedWidget: 1,
                showFreeWidget: 1,
                showMoviesWidget: 1,
                steamProfile: {
                    AccountName: "",
                    PersonaName: "",
                    accountId: "",
                    avatarImage: "",
                    id: ""
                },
                theme: 'system',
                uaAlarmId: null,
                useSystemNotification: 0
            }
        },
        games: [],
        hiddenFree: [],
        history: [],
        lastPlayed: {},
        movieFavorites: [],
        movies: {
            authorized: false,
            cookieString: null,
            proxy: "https://rezka-ua.org/"
        },
        playTime: {},
        progress: {},
        stats: {},
        weather: {
            sys: {
                country: ""
            }
        }
    }

    Object.entries(storage).map(([key, value]) => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    })
}