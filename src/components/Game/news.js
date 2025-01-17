import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import {useEffect, useState} from "react";

const News = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const [data, setData] = useState([])
    const {settings: {currentLang}} = getFromStorage('config')

    useEffect(() => {
        fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${game.steamId}&count=8&maxlength=400&l=${currentLang}&format=json`)
            .then(res => res.json())
            .then(({appnews: {newsitems}}) => {
                setData(newsitems)
            })
    }, [])

    const renderItem = (item) => {
        return (
            <li key={item.gid} tabIndex={1}>
                <h3>{item.title}</h3>
                <div style={{display: 'flex', marginBottom: '5px', gap: '5px'}}>
                    <address>By {item.author}</address>
                    on <time dateTime={new Date(item.date * 1000).toLocaleDateString()}
                             title={new Date(item.date * 1000).toLocaleDateString()}>{new Date(item.date * 1000).toLocaleDateString()}</time>

                </div>
                <div
                    dangerouslySetInnerHTML={{__html: item.contents.replace(/\{STEAM_CLAN_IMAGE}/gm, 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/clans/')}}/>
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