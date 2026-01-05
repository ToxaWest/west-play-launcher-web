import type {CSSProperties} from "react";

export type freeGameType = {
    store: string
    title: string
    image: string
    url: string
    added?: string
    expires: string
    appid: number
    expected: boolean
};

export type crackedGameType = {
    id: number
    user_score: number
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

export interface widgetWrapperStyleInterface extends CSSProperties {
    '--lines': string
}