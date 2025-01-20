import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import {useEffect, useState} from "react";

const News = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const [data, setData] = useState([])
    const {settings: {currentLang}} = getFromStorage('config')

    useEffect(() => {
        fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${game.steamId}&count=8&l=${currentLang}&format=json`)
            .then(res => res.json())
            .then(({appnews: {newsitems}}) => {
                console.log(newsitems);
                setData(newsitems)
            })
    }, [])

    const editorParser = (c) => c
        .replaceAll(/\r/gm, '')
        .replaceAll(/\n/gm, `<br/>`)
        .replaceAll(/\[url=(.*?)](.*?)\[\/url]/gm, '<a href="$1">$2</a>')
        .replaceAll(/\[\*](.*?)\[\*]/gm, `$1</li><li>`)
        .replaceAll(/\[list](.*?)\[\/list]/gm, `<ul><li>$1</ul></li>`)
        .replaceAll(/\[b](.*?)\[\/b]/gm, `<b>$1</b>`)
        .replaceAll(/\[h2](.*?)\[\/h2]/gm, `<h2>$1</h2>`)
        .replaceAll(/\[i](.*?)\[\/i]/gm, `<i>$1</i>`)
        .replaceAll(/\[img](.*?)\[\/img]/gm, `<img src="$1" style="max-width: 100%;"/>`)
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
        <div style={{zIndex: 5, position: "relative"}}>
            <ul>
                {data.map(renderItem)}
            </ul>
        </div>
    )

}

export default News;