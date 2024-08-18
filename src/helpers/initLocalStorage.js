export default function initLocalStorage() {
    const storage = {
        config: {settings: {}},
        games: [],
        lastPlayed: {},
        achievements: {},
        playTime: {}
    }

    Object.entries(storage).map(([key, value]) => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    })
}