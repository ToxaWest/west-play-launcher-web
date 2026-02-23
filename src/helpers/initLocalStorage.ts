import type {LocalStorageType} from "@type/localStorage.type";

export default function initLocalStorage() {
    const storage: LocalStorageType = {
        achievements: {},
        config: {
            settings: {
                currentLang: 'english',
                gamesInRow: 6,
                rpcs3: '',
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
                uaAlarmId: null
            }
        },
        games: [],
        gbe: {},
        hiddenFree: [],
        history: [],
        kinozal_cookies: [],
        lastPlayed: {},
        list_crack_games: [],
        list_free_games2: [],
        movieFavorites: [],
        movieTime: {},
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