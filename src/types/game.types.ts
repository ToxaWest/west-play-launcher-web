export type achievementInterfaceType = {
    name: string
    displayName: string
    defaultvalue: number
    description: string
    hidden: 1 | 0
    icon: string
    icongray: string
    rarity?: number
    type?: string
}

export type DlcType = {
    short_description: string
    header_image: string
    name: string
    id: string
    type: string
}

export type statInterfaceType = {
    name: string
    displayName: string
    defaultvalue: number
}

export type HLTBType = {
    allStylesTime: number
    mainTime:  number
    mainExtraTime: number
    completionistTime: number
}

export type GameVideoType = {
    type: string,
    thumbnail: string | {url: string}
    webm?: { max: string }
    mp4?: { max: string }
    recipes?: string
    poster?: string
    src?: {
        src: string,
        type: string
    }[]
    path?: string
    publicId?: string
    playbackURLs?: {
        url: string
        videoMimeType: string
    }[]
    provider?: 'youtube' | 'wistia'
    videoId?: string
    _links? : {
        thumbnail: {
            href: string
        }
    }
}

export type Game = {
    archive?: boolean
    steamgriddb?: string
    path: string,
    title: string,
    name: string,
    img_logo: string
    img_hero: string
    img_icon: string
    img_grid: string
    img_landscape?: string
    steamId?: number
    imageName?: string,
    dlcList: DlcType[]
    screenshots: { path_full: string }[]
    exePath: string,
    exeArgs: {
        [key: string]: string
    }
    movies: GameVideoType[]
    metacritic?: {
        score: number
    }
    release_date?: {
        date: string
    }
    about_the_game?: string,
    players?: number | string,
    required_age?: number | string,
    developers?: string[]
    short_description?: string
    source: 'steam' | 'egs' | 'ryujinx' | 'gog' | 'rpcs3'
    id: string | number
    unofficial: boolean
    productId?: string
    dlc: string[] | number[]
    achPath?: string
    storeUrl?: string
    buildVersion?: string
    downloadLink?: string
    size?: string,
    stats?: statInterfaceType[],
    achievements?: achievementInterfaceType[]
    hltb?: HLTBType
}

export type PlayTime = { [key: string | number]: number }
export type LastPlayed = { [key: string | number]: number }
export type StatsType = { [key: string | number]: string | number }
export type ProgressType = { [key: string | number]: number }
export type EarnedAchievementsType = {
    [name: string]: {
        earned_time?: number
        earned: boolean
        xp?: number
        progress?: number
    }
}
export type achievementsType = {
    [id: string | number]: EarnedAchievementsType
}

export interface KinozalGame {
    id: string;
    title: string;
    url: string;
    rank: string;
    size: string;
    seeds: number;
    peers: number;
    date: string;
    source: string;
}

export interface KinozalGameDetails {
    name: string;
    description: string;
    poster: string | null;
    downloadLink: string | null;
    screenshots?: string[];
}