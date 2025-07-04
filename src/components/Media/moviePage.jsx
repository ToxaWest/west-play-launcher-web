import React, {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from "./media.module.scss";
import Loader from "../Loader";
import Input from "../Input";
import movieStorage from "./movieStorage";
import useFooterActions from "../../hooks/useFooterActions";
import Player from "./player";

const moviePage = ({url, setUrl, goTo}) => {
    const {setFooterActions, removeFooterActions} = useFooterActions()
    const [showTrailer, setShowTrailer] = useState(false)
    const forward = (t) => {
        const player = document.querySelector('#hlsPlayer');
        if (player) {
            player.currentTime += t
        }
    }

    useEffect(() => {
        setFooterActions({
            a: {
                button: 'a',
                title: 'Select',
                onClick: () => {
                    if (document.fullscreenElement) {
                        const player = document.querySelector('#hlsPlayer');
                        if (player) {
                            player.paused ? player.play() : player.pause()
                        }
                    } else {
                        document.activeElement?.click();
                    }

                }
            },
            b: {
                button: 'b',
                title: 'Back',
                onClick: () => {
                    if (document.fullscreenElement) {
                        const player = document.querySelector('#hlsPlayer');
                        if (player) player.pause();
                        document.exitFullscreen();
                    } else setUrl(null);
                }
            },
            rt: {
                button: 'rt',
                title: 'Forward +',
                onClick: () => forward(15)
            },
            lt: {
                button: 'lt',
                title: 'Forward -',
                onClick: () => forward(-15)
            },
            y: {
                button: 'y',
                title: 'FullScreen',
                onClick: () => {
                    const player = document.querySelector('#hlsPlayer');
                    if (player) {
                        if (document.fullscreenElement) {
                            player.pause();
                            document.exitFullscreen();
                        } else player.requestFullscreen();
                    }
                }
            },
            x: {
                button: 'x',
                title: 'Play/Pause',
                onClick: () => {
                    const player = document.querySelector('#hlsPlayer');
                    if (player) {
                        player.paused ? player.play() : player.pause()
                    }
                }
            }
        })
        return () => {
            removeFooterActions(['lt', 'rt', 'x', 'y', 'b', 'a']);
        }
    }, [])
    const [data, setData] = useState({
        movie: {},
        translations: [],
        episodes: {},
        streams: {}
    })

    const [quality, setQuality] = useState('1080p Ultra')
    const [loading, setLoading] = useState(true)

    const clickListener = (evt) => {
        function getDataAttr(node, attrValue) {
            if (node && !node.getAttribute(attrValue)) {
                return getDataAttr(node.parentNode, attrValue)
            }
            const pageUrl = node.getAttribute(attrValue)
            if(!pageUrl.startsWith('http')) return;
            if(pageUrl.includes('/person/')) return;
            goTo(pageUrl)
            setUrl(null);
        }

        getDataAttr(evt.target, 'data-url')
    }

    useEffect(() => {
        setLoading(true)
        electronConnector.getSerialData(url).then(r => {
            setLoading(false)
            setData({
                trailer: r.trailer,
                type: r.type,
                step: 'init',
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
        document.getElementById('movieTable').addEventListener('click', clickListener)
    }, [])

    useEffect(() => {
        const h = movieStorage.getHistory(url);

        if (data.step === 'init') {
            if (h.season_id && h.episode_id && h.translation_id) {
                if (h.season_id !== data.season_id || h.episode_id !== data.episode_id || h.translation_id === data.translation_id) {
                    const r = data.episodes[h.season_id].find(e => parseInt(e.episode) === parseInt(h.episode_id));
                    setEpisode(r, h.translation_id)
                }
            } else if (h.translation_id && (h.translation_id !== data.translation_id)) {
                setTranslation(h.translation_id)
            }
        }

    }, [data.step])

    const setTranslation = (translation_id) => {
        setLoading(true);
        electronConnector.getAjaxVideo({
            method: 'get_cdn_series',
            data: {
                id: parseInt(data.post_id),
                translator_id: parseInt(translation_id),
                favs: data.trl_favs,
                action: data.type === "initCDNMoviesEvents" ? 'get_movie' : 'get_episodes'
            }
        }).then(r => {
            setData((d) => ({
                ...d,
                streams: r.streams,
                translation_id,
                episodes: r.episodes,
            }))
            setLoading(false);
        })
    }

    const setEpisode = (currentVideo, transId) => {
        setLoading(true);
        const translator_id = transId || data.translation_id;
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
                    translation_id: translator_id,
                    streams: r.streams,
                    season_id: parseInt(currentVideo.season),
                    episode_id: parseInt(currentVideo.episode),
                    episodes: r.episodes
                }
            })
            setLoading(false);
        })
    }

    const renderTrailer = () => {
        if (!data.trailer) return null
        if (!showTrailer) {
            return <button tabIndex={1} onClick={() => setShowTrailer(true)}>Show trailer</button>
        }
        const url = new URL(data.trailer);
        if (url.hostname.includes('youtube')) {
            const id = url.pathname.split('/').at(-1);
            return (
                <iframe
                    loading="lazy"
                    src={`https://www.youtube.com/embed/${id}?iv_load_policy=3&autoplay=1&loop=1&rel=0&mute=1&showinfo=0`}
                    frameBorder="0"/>
            )
        }
        return null
    }

    const renderTable = () => {
        if (!data.movie.table) return null
        return (
            <tbody>
            {data.movie.table.map(item => <tr key={item.title}>
                    <td>{item.title}</td>
                    <td dangerouslySetInnerHTML={{__html: item.value}}/>
                </tr>
            )}
            </tbody>
        )
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
                                   return {...d, episode_id: null, season_id: parseInt(value)}
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
                <Player episode_id={data.episode_id}
                        season_id={data.season_id}
                        quality={quality}
                        translation_id={data.translation_id}
                        episodes={data.episodes}
                        url={url}
                        streams={data.streams}
                        setEpisode={setEpisode}
                        setQuality={setQuality}
                />
            </div>
            <div style={{backgroundColor: 'var(--theme-color-transparent)'}}>
                {renderTrailer()}
                <table id={'movieTable'}>
                    {renderTable()}
                </table>
            </div>
            <Loader loading={loading}/>
        </div>
    )
}

export default moviePage;