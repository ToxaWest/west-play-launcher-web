export type movieSearch = {
    href: string
    description: string
    title: string
}

export type getPageData = {
    categories: {
        title: string
        data: {
            id: string
            options: {
                label: string
                value: string
            }[]
        }[]
    }[]
    heading: string,
    list: {
        image: string
        href: string
        title: string
    }[],
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

export type Episodes = Record<string,
    {
        current: boolean
        episode: string
        href: string
        id: string
        season: string
        text: string
    }>


export type getAjaxVideo = {
    episodes: Episodes
    streams: Streams
}

export type getSerialData = {
    trailer?: string
    type: 'initCDNMoviesEvents' | 'initCDNSeriesEvents'
    streams: Streams
    movie: {
        description: string
        image: string
        originalTitle: string
        table?: {
            title: string
            html: string
        }[]
        title: string
    }
    translation_id: string
    trl_favs: string
    post_id: string
    translations: string
    episodes: Episodes
    season_id: string
    episode_id: string
}

export type getSteamUserId = {
    AccountName: string
    PersonaName: string
    accountId: string
    avatarImage: string
    id: string
}

export type getDataByGameIdInput = {
    source: 'steam' | 'egs' | 'gog'
    id: string | number
    unofficial: boolean
    productId?: string
    dlc: string[] | number[]
}

export type getDataByGameId = {
    achPath?: string
    dlcList: {
        short_description: string
        header_image: string
        name: string
        id: string
        type: string
    }[]
    achievements?: {
        hidden: 1 | 0
        displayName: string
        description: string
        icon: string
        type?: string
        icongray: string
        name: string
    }[]
    stats?: {
        name: string
        displayName: string
    }[]

}