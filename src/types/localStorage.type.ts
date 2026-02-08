import type {getSteamUserId} from '@type/electron.types';
import type {achievementsType, Game, LastPlayed, PlayTime, ProgressType, StatsType} from "@type/game.types";
import type {MovieStorageFavorites, MovieStorageHistory} from "@type/movieStorage.types";
import type {crackedGameType, freeGameType} from "@type/widget.types";

export type LocalStorageType = {
    config: {
        settings: {
            rpcs3: string
            theme: 'system' | 'light' | 'dark'
            ryujinx: string,
            videoBg?: string
            gamesInRow: number,
            currentLang: string,
            showFreeWidget: 0 | 1,
            showCrackedWidget: 0 | 1,
            showMoviesWidget: 0 | 1,
            steamProfile: getSteamUserId,
            uaAlarmId: string | null
        }
    },
    weather: {
        id?: number
        name?: string
        sys?: {
            country: string
        }
    },
    movies: {
        authorized: boolean,
        cookieString: string | null,
        proxy: string
    }
    gbe: {
        [architecture: string]: {
            path: string,
            name: string,
            hash: string
        }
    },
    list_free_games2: freeGameType[],
    list_crack_games: crackedGameType[],
    movieTime: { [id: string]: number },
    movieFavorites: MovieStorageFavorites[],
    history: MovieStorageHistory[]
    hiddenFree: (string | number)[],
    games: Game[],
    lastPlayed: LastPlayed,
    achievements: achievementsType,
    stats: { [id: string | number]: StatsType },
    progress: { [id: string | number]: ProgressType },
    playTime: PlayTime,
    kinozal_cookies: any[]
}

export type LocalStorageKeys = keyof LocalStorageType;