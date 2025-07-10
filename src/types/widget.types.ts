export type freeGameType = {
    id: number
    name: string
    title: string
    short_image: string
    link: string
    endTime?: string
    startTime: string
    price: string
    shopName: string
};

export type crackedGameType = {
    id: number
    steam_prod_id: number
    short_image: string
    is_AAA: boolean
    readable_status: string
    title: string
    hacked_groups: string
    torrent_link: string
    teaser_link?: string
    crack_date: Date
}