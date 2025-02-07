import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import {useEffect, useState} from "react";
import styles from "./news.module.scss";
const News = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const [data, setData] = useState([])
    const {settings: {currentLang}} = getFromStorage('config')

    useEffect(() => {
        fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${game.steamId}&count=8&l=${currentLang}&format=json`)
            .then(res => res.json())
            .then(({appnews: {newsitems}}) => {
                setData(newsitems)
            })
    }, [])

    const editorParser = (c) => c
        .replaceAll(/\r/gm, '')
        .replaceAll(/\[\*](.*?)\n/gm, `<li>$1</li>`)
        .replaceAll(/\n/gm, `<div style="padding: 2px 0"></div>`)
        .replaceAll(/\[list](.*?)\[\/list]/gm, `<ul>$1</ul>`)
        .replaceAll(/\[url=(.*?)](.*?)\[\/url]/gm, '<a href="$1">$2</a>')
        .replaceAll(/\[b](.*?)\[\/b]/gm, `<b>$1</b>`)
        .replaceAll(/\[h1](.*?)\[\/h1]/gm, `<h1>$1</h1>`)
        .replaceAll(/\[h2](.*?)\[\/h2]/gm, `<h2>$1</h2>`)
        .replaceAll(/\[h3](.*?)\[\/h3]/gm, `<h3>$1</h3>`)
        .replaceAll(/\[table](.*?)\[\/table]/gm, `<table>$1</table>`)
        .replaceAll(/\[tr](.*?)\[\/tr]/gm, `<tr>$1</tr>`)
        .replaceAll(/\[th](.*?)\[\/th]/gm, `<th>$1</th>`)
        .replaceAll(/\[td](.*?)\[\/td]/gm, `<td>$1</td>`)
        .replaceAll(/\[i](.*?)\[\/i]/gm, `<i>$1</i>`)
        .replaceAll(/\[u](.*?)\[\/u]/gm, `<u>$1</u>`)
        .replaceAll(/\[previewyoutube=(.*?);full]\[\/previewyoutube]/gm, `<iframe frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube.com/embed/$1?autoplay=0&amp;showinfo=0&amp;autohide=1&amp;fs=1&amp;modestbranding=1&amp;rel=0&amp;playsinline=1&amp;iv_load_policy=3&amp;controls=1&amp;enablejsapi=1&amp;widgetid=1"></iframe>`)
        .replaceAll(/\[quote](.*?)\[\/quote]/gm, `<quote>$1</quote>`)
        .replaceAll(/\[img](.*?)\[\/img]/gm, `<img src="$1" style="max-width: 100%;"/>`)
        .replaceAll(/width="(.*?)"/gm, 'style="max-width: 100%;"')
        .replaceAll(/height="(.*?)"/gm, '')
        .replaceAll(/\{STEAM_CLAN_IMAGE}/gm, 'https://clan.fastly.steamstatic.com/images/')

    const renderItem = (item) => {
        return (
            <li key={item.gid} tabIndex={1}>
                <h3>{item.title}</h3>
                <div style={{display: 'flex', marginBottom: '5px', gap: '5px'}}>
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
            <ul>
                {data.map(renderItem)}
            </ul>
        </div>
    )

}

export default News;