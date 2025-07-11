import type {LocalStorageType} from "../types/localStorage.type";

export default function initLocalStorage() {
    const storage: LocalStorageType = {
        achievements: {},
        config: {
            settings: {
                alternativeAchievementsView: 0,
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
                theme: 'system'
            }
        },
        games: [],
        hiddenFree: [],
        history: [],
        lastPlayed: {},
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