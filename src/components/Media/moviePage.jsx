import React, {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from "./media.module.scss";
import Loader from "../Loader";
import Hls from "hls.js";
import Input from "../Input";
import movieStorage from "./movieStorage";

const moviePage = ({url, setUrl}) => {
    const [data, setData] = useState({
        movie: {},
        translations: [],
        episodes: {}
    })
    const [quality, setQuality] = useState('1080p')
    const [streams, setStreams] = useState({})
    const [loading, setLoading] = useState(true)
    const playerRef = React.useRef(null);
    const hlsRef = React.useRef(null);

    useEffect(() => {
        hlsRef.current = new Hls();
        hlsRef.current.attachMedia(playerRef.current);
        setLoading(true)
        electronConnector.getSerialData(url).then(r => {
            setLoading(false)
            setStreams(r.streams)
            setData({
                movie: r.movie,
                translation_id: r.translation_id,
                trl_favs: r.trl_favs,
                post_id: r.post_id,
                translations: r.translations,
                episodes: r.episodes,
                season_id: parseInt(r.season_id),
                episode_id: parseInt(r.episode_id),
            })
            movieStorage.addToHistory({url, image: r.movie.image, title: r.movie.title})
            initPlayer(r.streams)
        })
    }, [url])

    const initPlayer = (streams) => {
        if (!playerRef.current) return;
        if (!streams[quality]) return;
        const files = streams[quality].filter(s => s.endsWith('.m3u8'));
        hlsRef.current.loadSource(files[0]);
        hlsRef.current.on(Hls.Events.ERROR, function (event, data) {
            console.log("Hls.Events.ERROR", data);
            if (data.fatal) {
                if (files[1] && data.url !== files[1]) {
                    hlsRef.current.loadSource(files[1]);
                }
                hlsRef.current.startLoad();
            }
        });
    }

    useEffect(() => {
        if (streams.hasOwnProperty(quality)) {
            initPlayer(streams)
        }
    }, [quality])

    const setTranslation = (translation_id) => {
        setLoading(true);
        electronConnector.getAjaxVideo({
            method: 'get_cdn_series',
            data: {
                id: parseInt(data.post_id),
                translator_id: parseInt(translation_id),
                favs: data.trl_favs,
                action: 'get_episodes'
            }
        }).then(r => {
            setStreams(r.streams)
            setData((d) => {
                return {
                    ...d,
                    translation_id,
                    episodes: r.episodes,
                    translations: d.translations.map((t) => {
                        t.current = t.id === translation_id;
                        return t;
                    })
                }
            })
            setLoading(false);
            initPlayer(r.streams)
        })
    }

    const setEpisode = (currentVideo) => {
        setLoading(true);
        const translator_id = data.translations.length ? data.translations.find(t => t.current).id : data.translation_id;
        electronConnector.getAjaxVideo({
            method: 'get_cdn_series',
            data: {
                id: parseInt(currentVideo.id),
                translator_id: parseInt(translator_id),
                season: parseInt(currentVideo.season),
                episode: parseInt(currentVideo.episode),
                favs: data.trl_favs,
                action: 'get_episodes'
            }
        }).then(r => {
            setStreams(r.streams)
            setData((d) => {
                return {
                    ...d,
                    season_id: parseInt(currentVideo.season),
                    episode_id: parseInt(currentVideo.episode),
                    episodes: r.episodes
                }
            })
            setLoading(false);
            initPlayer(r.streams)
        })
    }

    return (
        <div className={styles.wrapperMovie}>
            <h1>{data.movie.title}</h1>
            <h3>{data.movie.originalTitle}</h3>
            <img src={data.movie.image} alt={data.movie.title}/>
            <p>{data.movie.description}</p>
            <div className={styles.optionsWrapper}>
                <button onClick={() => {
                    setUrl(null);
                }}>Back
                </button>
                <button onClick={() => {
                    movieStorage.removeHistory(url)
                    setUrl(null);
                }}>Remove from history
                </button>
                <button onClick={() => {
                    playerRef.current.requestFullscreen();
                }}>FullScreen
                </button>
                <button onClick={() => {
                    playerRef.current.play();
                }}>Play
                </button>
                <button onClick={() => {
                    playerRef.current.pause();
                }}>Pause
                </button>
                {data.translations.length ?
                    <Input label={'Translation'}
                           type="select"
                           value={data.translation_id}
                           options={data.translations.map(t => ({
                               value: t.id,
                               label: t.title,
                               html: t.html
                           }))}
                           onChange={({value}) => {
                               setTranslation(value)
                           }}
                    /> : null}
                {Object.keys(data.episodes).length ?
                    <Input label={'Season'} type="select"
                           options={Object.keys(data.episodes).map(key => ({
                               value: parseInt(key),
                               label: key
                           }))}
                           value={data.season_id}
                           onChange={({value}) => {
                               setData((d) => {
                                   return {
                                       ...d,
                                       episode_id: null,
                                       season_id: parseInt(value)
                                   }
                               })
                           }}/> : null}
                {(data.episodes[data.season_id] || []).length ?
                    <Input label={'Episode'} type="select"
                           options={(data.episodes[data.season_id] || []).map(item => ({
                               value: item.season + '_' + item.episode,
                               label: item.text
                           }))}
                           value={data.season_id + '_' + data.episode_id}
                           onChange={({value}) => {
                               if (!value) return;
                               const episode = value.split('_');
                               const ep = data.episodes[data.season_id].find(e => parseInt(e.episode) === parseInt(episode[1]));
                               setEpisode(ep)
                           }}/>
                    : null}
                {Object.keys(streams || {}).length ?
                    <Input label={'Quality'} type="select"
                           options={Object.keys(streams).map(key => ({
                               value: key,
                               label: key
                           }))} value={quality}
                           onChange={({value}) => {
                               setQuality(value)
                           }}/> : null}
            </div>
            <div className={styles.videoWrapper}>
                <video className={styles.player} controls={true} ref={playerRef} autoPlay={true}
                       onPlay={() => {
                           const {season_id, episode_id, translation_id} = data;
                           movieStorage.update({season_id, episode_id, translation_id, url})
                       }}
                       onEnded={() => {
                           if (data.episodes.hasOwnProperty(data.season_id)) {
                               const nS = data.episodes[data.season_id].find(b => parseInt(b.episode) === (data.episode_id + 1) && parseInt(b.season) === data.season_id)
                               if (nS) setEpisode(nS)
                           }

                       }}/>
            </div>
            <Loader loading={loading}/>
        </div>
    )
}

export default moviePage;