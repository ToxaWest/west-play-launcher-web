export type MovieStorageHistory = {
    title: string
    image: string
    href: string
    subtitle: string
    currentTime?: number
    season_id?: number
    episode_id?: number
    translation_id?: string
}

export type MovieStorageFavorites = {
    subtitle: string
    title: string
    image: string
    href: string
}