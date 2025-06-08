import {getFromStorage} from "../../helpers/getFromStorage";
import {startTransition, useActionState, useEffect} from "react";
import styles from "./news.module.scss";
import Loader from "../Loader";

const NewsRender = ({id}) => {
    const {settings: {currentLang}} = getFromStorage('config')
    const [{data, showMore}, fetchData, loading] = useActionState(async (prev, page = 0) => {
        const {page: p} = prev;
        const {appnews: {newsitems}} = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${id}&count=${(p + page) * 6}&l=${currentLang}&format=json`)
            .then(res => res.json())
        return {data: newsitems, page: page + p, showMore: ((p + page) * 6) === newsitems.length};
    }, {data: [], page: 1, showMore: true})

    useEffect(() => {
        startTransition(() => fetchData(0))
    }, [])

    const editorParser = (c) => c
        .replaceAll(/\r/gm, '')
        .replaceAll(/\[\*](.*?)\n/gm, `<li>$1</li>`)
        .replaceAll(/\n/gm, `<div style="padding: 2px 0"></div>`)
        .replaceAll(/\[p](.*?)\[\/p]/gm, `<p>$1</p>`)
        .replaceAll(/\[list]/gm, `<ul>`)
        .replaceAll(/\[\/list]/gm, `</ul>`)
        .replaceAll(/\[olist]/gm, `<ol>`)
        .replaceAll(/\[\/olist]/gm, `</ol>`)
        .replaceAll(/\[\*](.*?)<\/ol>/gm, `<li>$1</ol></li>`)
        .replaceAll(/\[\*](.*?)<\/ul>/gm, `<li>$1</ul></li>`)
        .replaceAll(/\[url="(.*?)"](.*?)\[\/url]/gm, '<button onclick="event.preventDefault();window.api.openLink(\'$1\'.split(\' \')[0])">$2</button>')
        .replaceAll(/\[url=(.*?)](.*?)\[\/url]/gm, '<button onclick="event.preventDefault();window.api.openLink(\'$1\'.split(\' \')[0])">$2</button>')
        .replaceAll(/\[dynamiclink href="(.*?)"]\[\/dynamiclink]/gm, '<button onclick="event.preventDefault();window.api.openLink(\'$1\'.split(\' \')[0])">$1</button>')
        .replaceAll(/\[b](.*?)\[\/b]/gm, `<b>$1</b>`)
        .replaceAll(/\[h1](.*?)\[\/h1]/gm, `<h1>$1</h1>`)
        .replaceAll(/\[h2](.*?)\[\/h2]/gm, `<h2>$1</h2>`)
        .replaceAll(/\[h3](.*?)\[\/h3]/gm, `<h3>$1</h3>`)
        .replaceAll(/\[h4](.*?)\[\/h4]/gm, `<h4>$1</h4>`)
        .replaceAll(/\[h5](.*?)\[\/h5]/gm, `<h5>$1</h5>`)
        .replaceAll(/\[hr]\[\/hr]/gm, `<hr/>`)
        .replaceAll(/\[table](.*?)\[\/table]/gm, `<table>$1</table>`)
        .replaceAll(/\[tr](.*?)\[\/tr]/gm, `<tr>$1</tr>`)
        .replaceAll(/\[th](.*?)\[\/th]/gm, `<th>$1</th>`)
        .replaceAll(/\[td](.*?)\[\/td]/gm, `<td>$1</td>`)
        .replaceAll(/\[i](.*?)\[\/i]/gm, `<i>$1</i>`)
        .replaceAll(/\[u](.*?)\[\/u]/gm, `<u>$1</u>`)
        .replaceAll(/\[ (.*?) ]/gm, `<strong>$1</strong>`)
        .replaceAll(/\[previewyoutube=(.*?);full]\[\/previewyoutube]/gm, `<iframe frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube.com/embed/$1?autoplay=0&amp;showinfo=0&amp;autohide=1&amp;fs=1&amp;modestbranding=1&amp;rel=0&amp;playsinline=1&amp;iv_load_policy=3&amp;controls=1&amp;enablejsapi=1&amp;widgetid=1"></iframe>`)
        .replaceAll(/\[previewyoutube="(.*?);full"]\[\/previewyoutube]/gm, `<iframe frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube.com/embed/$1?autoplay=0&amp;showinfo=0&amp;autohide=1&amp;fs=1&amp;modestbranding=1&amp;rel=0&amp;playsinline=1&amp;iv_load_policy=3&amp;controls=1&amp;enablejsapi=1&amp;widgetid=1"></iframe>`)
        .replaceAll(/\[quote](.*?)\[\/quote]/gm, `<quote>$1</quote>`)
        .replaceAll(/\[video mp4=(.*?) webm=(.*?) poster=(.*?) autoplay=(.*?) controls=(.*?)]\[\/video]/gm, `<video src="$2" controls="$5" autoplay="$4" style="max-width: 100%;" poster="$3"/>`)
        .replaceAll(/\[img](.*?)\[\/img]/gm, `<img src="$1" style="max-width: 100%;"/>`)
        .replaceAll(/\[img src="(.*?)"]\[\/img]/gm, `<img src="$1" style="max-width: 100%;"/>`)
        .replaceAll(/width="(.*?)"/gm, 'style="max-width: 100%;"')
        .replaceAll(/height="(.*?)"/gm, '')
        .replaceAll(/<img /gm, `<img onerror="this.style.display='none'" `)
        .replaceAll(/<a /gm, `<a onclick="event.preventDefault();window.api.openLink(event.target.href)" `)
        .replaceAll(/\{STEAM_CLAN_IMAGE}/gm, 'https://clan.fastly.steamstatic.com/images/')
        .replaceAll(/\[\*]/gm, '')
        .replaceAll(/\[\/\*]/gm, '')

    const renderItem = (item) => {
        return (
            <li key={item.gid} className={styles.item}>
                <h3>{item.title}</h3>
                <div className={styles.date}>
                    <address>By {item.author}</address>
                    on <time dateTime={new Date(item.date * 1000).toLocaleDateString()}
                             title={new Date(item.date * 1000).toLocaleDateString()}>{new Date(item.date * 1000).toLocaleDateString()}</time>

                </div>
                <div dangerouslySetInnerHTML={{__html: editorParser(item.contents)}}/>
            </li>
        )
    }

    return (
        <div className={styles.wrapper}>
            <Loader loading={loading}/>
            <ul>
                {data.map(renderItem)}
            </ul>
            {showMore && <button tabIndex={1} onClick={() => {
                startTransition(() => fetchData(1))
            }}>Load More
            </button>}
        </div>
    )
}

export default NewsRender;