export default function initLocalStorage() {
    const storage = {
        config: {
            settings: {
                gamesInRow: 6,
                currentLang: 'english',
                showFreeWidget: true,
                showCrackedWidget: true,
                steamProfile: {}
            }
        },
        weather: {},
        hiddenFree: [],
        games: [],
        lastPlayed: {},
        achievements: {},
        stats: {},
        progress: {},
        playTime: {}
    }

    Object.entries(storage).map(([key, value]) => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    })
}