import React from "react";

import bbCodeParser from "../../helpers/bbCodeParser";
import {getFromStorage} from "../../helpers/getFromStorage";
import newsCarousel from "../../helpers/newsCarousel";
import i18n from "../../helpers/translate";
import Loader from "../Loader";

import styles from "./news.module.scss";

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
        const {appnews: {newsitems}} = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${id}&count=${(p + page) * 6}&l=${currentLang}&format=json`)
            .then(res => res.json()) as { appnews: { newsitems: NewsItemType[] } }
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
            <li key={item.gid} className={styles.item}>
                <h3>{item.title}</h3>
                <div className={styles.date}>
                    <address>By {item.author}</address>
                    on <time dateTime={date} title={date}>{date}</time>
                </div>
                <div dangerouslySetInnerHTML={{__html: bbCodeParser(item.contents)}}/>
            </li>
        )
    }

    return (
        <div className={styles.wrapper}>
            <Loader loading={loading}/>
            <ul>
                {data.map(renderItem)}
            </ul>
            {showMore && <button tabIndex={1} type="submit" onClick={() => {
                React.startTransition(() => fetchData(1))
            }}>{i18n.t('Load More')}
            </button>}
        </div>
    )
}

export default NewsRender;