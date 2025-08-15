import {HLTBType} from "@type/game.types";

export type movieSearch = {
    href: string
    description: string
    title: string
}

export type MoviePageCategory = {
    title: string
    data: {
        id: string
        options: {
            label: string
            value: string
        }[]
    }[]
}

export type MoviesListItem = {
    image: string
    href: string
    subtitle: string
    title: string
}

export type moviesCollection = {
    href: string
    title: string
}

export type getPageData = {
    filters: { title: string, url: string, active: boolean }[]
    categories: MoviePageCategory[]
    heading: string,
    links: moviesCollection[],
    list: MoviesListItem[],
    pagination: {
        next?: string
        prev?: string
    },
    title: string
}

export type getAjaxVideoInput = {
    data: {
        id: number
        translator_id: number
        episode?: number
        season?: number
        favs: string
        action: 'get_movie' | 'get_episodes'
    }
    method: 'get_cdn_series'
}

export type Streams = Record<'360p' | '720p' | '1080p' | '1080p Ultra', string[]>

export type EpisodeItem = {
    current: boolean
    episode: string
    href: string
    id: string
    season: string
    text: string
}

export type Episodes = Record<number, EpisodeItem[]>

export type getAjaxVideo = {
    episodes: Episodes
    streams: Streams
    subtitle?: string,
    thumbnails?: string,
}

export type movieType = {
    description: string
    image: string
    originalTitle: string
    table?: {
        title: string
        html: string
        value: string
    }[]
    title: string
}

export type movieTranslationItem = {
    id: string
    html: string
    title: string
}

export type moviePartContentType = {
    id: number
    year: string
    title: string
    url?: string
    rating: string
}

export type movieScheduleItemType = {
    date: string
    episode: string
    exist: string
    id: string
    title: string
}

export type movieScheduleType = {
    title: string
    data: movieScheduleItemType[]
}

export type getSerialData = {
    trailer?: string,
    subtitle?: string,
    thumbnails?: string,
    schedule: movieScheduleType[]
    partContent: moviePartContentType[]
    type: 'initCDNMoviesEvents' | 'initCDNSeriesEvents'
    streams: Streams
    movie?: movieType
    translation_id: string
    trl_favs: string
    post_id: string
    translations: movieTranslationItem[]
    episodes: Episodes
    season_id: string
    episode_id: string
}

export type ConnectedMonitorType = {
    DisplayId: number,
    DisplayName: string,
    Active: boolean,
    Primary: boolean
}

export type getSteamUserId = {
    AccountName: string
    PersonaName: string
    accountId: string
    avatarImage: string
    id: string
}

export type getDataByGameIdInput = {
    source: 'steam' | 'egs' | 'gog' | 'ryujinx'
    id: string | number
    unofficial: boolean
    productId?: string
    dlc: string[] | number[]
}

export type FileManagerFolderType = {
    name: string
    isFolder: boolean
    path: string
}

export type steamgriddbTypes = 'grid' | 'hero' | 'logo' | 'icon'

export type getImageInput = {
    animated: boolean
    limit: number
    order: string
    page: number
    epilepsy: boolean
    game_id: number[]
    static: boolean
    asset_type: steamgriddbTypes
    dimensions?: string[]
}

export type getImageAssets = {
    id: string
    url: string
    thumb: string
    author: {
        name: string
    }
}

export type getSteamAssetsOutput = {
    [key in `img_${steamgriddbTypes}`]: string
}

export type HLTBSearchResponse = HLTBType & {
    id: number
    name: string
    releaseYear: number
    type: string
}

export type SteamSearchResponse = {
    appid: number
    name: string
    logo: string
}

export type steamGridDbSearchResponse = {
    id: number
    name: string
    release_date: number
}