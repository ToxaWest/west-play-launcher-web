import type {getSteamUserId} from '@type/electron.types';
import type {achievementsType,Game, LastPlayed, PlayTime, ProgressType, StatsType} from "@type/game.types";
import type {MovieStorageFavorites, MovieStorageHistory} from "@type/movieStorage.types";

export type LocalStorageType = {
    config: {
        settings: {
            theme: 'system' | 'light' | 'dark'
            alternativeAchievementsView: 0 | 1,
            ryujinx: string,
            videoBg?: string
            gamesInRow: number,
            currentLang: string,
            showFreeWidget: 0 | 1,
            showCrackedWidget: 0 | 1,
            showMoviesWidget: 0 | 1,
            steamProfile: getSteamUserId
        }
    },
    weather: {
        id?: number
        name?: string
        sys?: {
            country: string
        }
    },
    movieFavorites: MovieStorageFavorites[],
    history: MovieStorageHistory[]
    hiddenFree: (string | number)[],
    games: Game[],
    lastPlayed: LastPlayed,
    achievements: achievementsType,
    stats: { [id: string | number]: StatsType },
    progress: { [id: string | number]: ProgressType},
    playTime: PlayTime
}

export type LocalStorageKeys = keyof LocalStorageType;