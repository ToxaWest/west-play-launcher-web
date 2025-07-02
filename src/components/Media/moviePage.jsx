import React, {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from "./media.module.scss";
import Loader from "../Loader";
import Input from "../Input";
import movieStorage from "./movieStorage";
import useFooterActions from "../../hooks/useFooterActions";
import Player from "./player";

const moviePage = ({url, setUrl}) => {
    const {setFooterActions} = useFooterActions()
    const playerRef = React.createRef();
    useEffect(() => {
        setFooterActions({
            b: {
                button: 'b',
                title: 'Back',
                onClick: () => {
                    setUrl(null);
                }
            },
        })
    }, [])
    const [data, setData] = useState({
        movie: {},
        translations: [],
        episodes: {},
        streams: {}
    })

    const [quality, setQuality] = useState('1080p Ultra')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        electronConnector.getSerialData(url).then(r => {
            setLoading(false)
            setData({
                streams: r.streams,
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
        })
    }, [url])

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
            setData((d) => {
                return {
                    ...d,
                    streams: r.streams,
                    translation_id,
                    episodes: r.episodes,
                    translations: d.translations.map((t) => {
                        t.current = t.id === translation_id;
                        return t;
                    })
                }
            })
            setLoading(false);
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
            setData((d) => {
                return {
                    ...d,
                    streams: r.streams,
                    season_id: parseInt(currentVideo.season),
                    episode_id: parseInt(currentVideo.episode),
                    episodes: r.episodes
                }
            })
            setLoading(false);
        })
    }

    return (
        <div className={styles.wrapperMovie}>
            <div className={styles.description}>
                <img src={data.movie.image} alt={data.movie.title}/>
                <div className={styles.descriptionContent}>
                    <h1>{data.movie.title}</h1>
                    <h3>{data.movie.originalTitle}</h3>
                    <p>{data.movie.description}</p>
                </div>
            </div>
            <div className={styles.optionsWrapper}>
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
                {Object.keys(data.streams || {}).length ?
                    <Input label={'Quality'} type="select"
                           options={Object.keys(data.streams).map(key => ({
                               value: key,
                               label: key
                           }))} value={quality}
                           onChange={({value}) => {
                               setQuality(value)
                           }}/> : null}
            </div>
            <div className={styles.optionsWrapper}>
                <button tabIndex={1} onClick={() => {
                    movieStorage.removeHistory(url)
                    setUrl(null);
                }}>Remove from history
                </button>
                <button tabIndex={1} onClick={() => {
                    console.log(playerRef)
                    playerRef.current.requestFullscreen();
                }}>FullScreen
                </button>
                <button tabIndex={1} onClick={() => {
                    playerRef.current.play();
                }}>Play
                </button>
                <button tabIndex={1} onClick={() => {
                    playerRef.current.pause();
                }}>Pause
                </button>
            </div>
            <div className={styles.videoWrapper}>
                <Player episode_id={data.episode_id}
                        season_id={data.season_id}
                        quality={quality}
                        translation_id={data.translation_id}
                        episodes={data.episodes}
                        ref={playerRef}
                        streams={data.streams}
                        setEpisode={setEpisode}
                        setQuality={setQuality}
                />
            </div>
            <Loader loading={loading}/>
        </div>
    )
}

export default moviePage;