import React from "react";

import bbCodeParser from "../../helpers/bbCodeParser";
import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import newsCarousel from "../../helpers/newsCarousel";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

type NewsItemType = {
    date: number
    contents: string
    title: string
    author: string
    gid: string
}

const NewsRender = ({id}) => {
    const {settings: {currentLang}} = getFromStorage('config')
    const [{data, showMore}, fetchData, loading] = React.useActionState<Promise<{
        showMore: boolean
        data: NewsItemType[]
        page: number
    }>, number>(async ({page: p}, page = 0) => {
        const {appnews: {newsitems}} = await electronConnector.beProxy<{ appnews: { newsitems: NewsItemType[] } }>({
            type: 'json',
            url: `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${id}&count=${(p + page) * 6}&l=${currentLang}&format=json`
        })
        return {data: newsitems, page: page + p, showMore: ((p + page) * 6) === newsitems.length};
    }, {data: [], page: 1, showMore: true})

    React.useEffect(() => {
        newsCarousel()
    }, [data])

    React.useEffect(() => {
        React.startTransition(() => fetchData(0))
    }, [])

    const renderItem = (item: NewsItemType) => {
        const date = new Date(item.date * 1000).toLocaleDateString()
        return (
            <li key={item.gid} className="bbcode rounded-theme p-theme min-w-0 relative glass before:content-[''] before:absolute before:inset-0 before:bg-theme-transparent before:z-[-1] [&_img]:max-w-full [&_img]:block [&_img]:my-gap [&_img]:mx-auto [&_h3]:my-gap-half [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:border-none [&_a]:underline [&_a]:text-text-secondary">
                <h3 className="border-b border-theme-transparent">{item.title}</h3>
                <div className="flex items-center gap-gap-half mb-gap">
                    <address>By {item.author}</address>
                    on <time dateTime={date} title={date} className="font-bold text-[1.4rem]">{date}</time>
                </div>
                <div dangerouslySetInnerHTML={{__html: bbCodeParser(item.contents)}}/>
            </li>
        )
    }

    return (
        <div className="z-[5] relative flex flex-col">
            <Loader loading={loading}/>
            <ul className="m-theme p-0 grid grid-cols-2 list-none rounded-theme gap-gap overflow-hidden">
                {data.map(renderItem)}
            </ul>
            {showMore && <button tabIndex={1} type="submit" className="my-gap mx-auto" onClick={() => {
                React.startTransition(() => fetchData(1))
            }}>{i18n.t('Load More')}
            </button>}
        </div>
    )
}

export default NewsRender;