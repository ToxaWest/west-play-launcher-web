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
                steamProfile: {},
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
            sys: {}
        }
    }

    Object.entries(storage).map(([key, value]) => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    })
}