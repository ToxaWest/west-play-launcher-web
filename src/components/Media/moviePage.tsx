import React, {useEffect, useState} from "react";

import electronConnector from "../../helpers/electronConnector";
import useFooterActions from "../../hooks/useFooterActions";
import {EpisodeItem, Episodes, movieTranslationItem, movieType,Streams} from "../../types/electron.types";
import {MovieStorageHistory} from "../../types/movieStorage.types";
import Input from "../Input";
import Loader from "../Loader";

import movieStorage from "./movieStorage";
import Player from "./player";

import styles from "./media.module.scss";

const MoviePage = ({url, setUrl, goTo}: {
    url: string,
    setUrl: (url: string) => void,
    goTo: (url: string) => void,
}) => {
    const {setFooterActions, removeFooterActions} = useFooterActions()
    const [showTrailer, setShowTrailer] = useState(false)
    const forward = (t: number) => {
        const player = document.querySelector('#hlsPlayer') as HTMLVideoElement;
        if (player) {
            player.currentTime += t
        }
    }

    useEffect(() => {
        setFooterActions({
            a: {
                button: 'a',
                onClick: () => {
                    if (document.fullscreenElement) {
                        const player = document.querySelector('#hlsPlayer') as HTMLVideoElement;
                        if (player) {
                            player.paused ? player.play() : player.pause()
                        }
                    } else {
                        (document.activeElement as HTMLElement)?.click();
                    }
                },
                title: 'Select'
            },
            b: {
                button: 'b',
                onClick: () => {
                    if (document.fullscreenElement) {
                        document.exitFullscreen().then(() => {
                            const player = document.querySelector('#hlsPlayer') as HTMLVideoElement;
                            if (player) player.pause();
                        })
                    } else setUrl(null);
                },
                title: 'Back'
            },
            lt: {
                button: 'lt',
                onClick: () => forward(-15),
                title: 'Forward -'
            },
            rt: {
                button: 'rt',
                onClick: () => forward(15),
                title: 'Forward +'
            },
            x: {
                button: 'x',
                onClick: () => {
                    const player = document.querySelector('#hlsPlayer') as HTMLVideoElement;
                    if (player) {
                        player.paused ? player.play() : player.pause()
                    }
                },
                title: 'Play/Pause'
            },
            y: {
                button: 'y',
                onClick: () => {
                    const player = document.querySelector('#hlsPlayer') as HTMLVideoElement;
                    if (player) {
                        if (document.fullscreenElement) {
                            document.exitFullscreen().then(() => {
                                player.pause();
                            });
                        } else player.requestFullscreen().then(() => {
                            player.play();
                        });
                    }
                },
                title: 'FullScreen'
            }
        })
        return () => {
            removeFooterActions(['lt', 'rt', 'x', 'y', 'b', 'a']);
        }
    }, [])
    const [data, setData] = useState<{
        trailer?: string,
        type?: 'initCDNMoviesEvents' | 'initCDNSeriesEvents',
        step?: 'init' | 'episodes' | 'translations',
        movie?: movieType,
        translations: movieTranslationItem[],
        translation_id?: string
        streams?: Streams | {}
        episodes?: Episodes | {}
        trl_favs?: string
        post_id?: string
        season_id?: number
        episode_id?: number
    }>(
        {
            episodes: {},
            movie: {
                description: '',
                image: '',
                originalTitle: '',
                table: [],
                title: '',
            },
            streams: {},
            translations: []
        }
    )

    const [quality, setQuality] = useState<keyof Streams>('1080p Ultra')
    const [loading, setLoading] = useState<boolean>(true)

    const clickListener = (event: MouseEvent) => {
        function getDataAttr(node: HTMLElement, attrValue: string) {
            if (node && !node.getAttribute(attrValue)) {
                return getDataAttr(node.parentNode as HTMLElement, attrValue)
            }
            const pageUrl = node.getAttribute(attrValue)
            if (!pageUrl.startsWith('http')) return;
            if (pageUrl.includes('/person/')) return;
            goTo(pageUrl)
            setUrl(null);
        }

        getDataAttr(event.target as HTMLElement, 'data-url')
    }

    useEffect(() => {
        setLoading(true)
        electronConnector.getSerialData(url).then(r => {
            setLoading(false)
            setData({
                episode_id: parseInt(r.episode_id),
                episodes: r.episodes,
                movie: r.movie,
                post_id: r.post_id,
                season_id: parseInt(r.season_id),
                step: 'init',
                streams: r.streams,
                trailer: r.trailer,
                translation_id: r.translation_id,
                translations: r.translations,
                trl_favs: r.trl_favs,
                type: r.type,
            })
            movieStorage.addToHistory({image: r.movie.image, title: r.movie.title, url})
        })

        // eslint-disable-next-line @eslint-react/web-api/no-leaked-event-listener
        document.getElementById('movieTable').addEventListener('click', clickListener)

        return () => {
            document.getElementById('movieTable').removeEventListener('click', clickListener)
        }
    }, [])

    useEffect(() => {
        const h = movieStorage.getHistory(url) as MovieStorageHistory;

        if (data.step === 'init') {
            if (h.season_id && h.episode_id && h.translation_id) {
                if (h.season_id !== data.season_id || h.episode_id !== data.episode_id || h.translation_id === data.translation_id) {
                    const r = data.episodes[h.season_id].find((e: EpisodeItem) => parseInt(e.episode) === h.episode_id);
                    setEpisode(r, h.translation_id)
                }
            } else if (h.translation_id && (h.translation_id !== data.translation_id)) {
                setTranslation(h.translation_id)
            }
        }

    }, [data.step])

    const setTranslation = (translation_id: string) => {
        setLoading(true);
        electronConnector.getAjaxVideo({
            data: {
                action: data.type === "initCDNMoviesEvents" ? 'get_movie' : 'get_episodes',
                favs: data.trl_favs,
                id: parseInt(data.post_id),
                translator_id: parseInt(translation_id)
            },
            method: 'get_cdn_series'
        }).then(r => {
            setData((d) => ({
                ...d,
                episodes: r.episodes,
                streams: r.streams,
                translation_id,
            }))
            setLoading(false);
        })
    }

    const setEpisode = (currentVideo: EpisodeItem, transId?: string) => {
        setLoading(true);
        const translator_id = transId || data.translation_id;
        electronConnector.getAjaxVideo({
            data: {
                action: 'get_episodes',
                episode: parseInt(currentVideo.episode),
                favs: data.trl_favs,
                id: parseInt(currentVideo.id),
                season: parseInt(currentVideo.season),
                translator_id: parseInt(translator_id)
            },
            method: 'get_cdn_series'
        }).then(r => {
            setData((d) => {
                return {
                    ...d,
                    episode_id: parseInt(currentVideo.episode),
                    episodes: r.episodes,
                    season_id: parseInt(currentVideo.season),
                    streams: r.streams,
                    translation_id: translator_id
                }
            })
            setLoading(false);
        })
    }

    const renderTrailer = () => {
        if (!data.trailer) return null
        if (!showTrailer) {
            return <button tabIndex={1} type="button" onClick={() => setShowTrailer(true)}>Show trailer</button>
        }
        const url = new URL(data.trailer);
        if (url.hostname.includes('youtube')) {
            const id = url.pathname.split('/').at(-1);
            return (
                <iframe
                    sandbox=""
                    loading="lazy"
                    title={'trailer'}
                    src={`https://www.youtube.com/embed/${id}?iv_load_policy=3&autoplay=1&loop=1&rel=0&mute=1&showinfo=0`}
                />
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
                               html: t.html,
                               label: t.title,
                               value: t.id
                           }))}
                           onChange={({value}) => {
                               setTranslation(value as string)
                           }}
                    /> : null}
                {Object.keys(data.episodes).length ?
                    <Input label={'Season'} type="select"
                           options={Object.keys(data.episodes).map(key => ({
                               label: key,
                               value: parseInt(key)
                           }))}
                           value={data.season_id}
                           onChange={({value}) => {
                               setData((d) => {
                                   return {...d, episode_id: null, season_id: parseInt(value as string)}
                               })
                           }}/> : null}
                {(data.episodes[data.season_id] || []).length ?
                    <Input label={'Episode'} type="select"
                           options={(data.episodes[data.season_id] || []).map((item: EpisodeItem) => ({
                               label: item.text,
                               value: item.season + '_' + item.episode
                           }))}
                           value={data.season_id + '_' + data.episode_id}
                           onChange={({value}) => {
                               if (!value) return;
                               const episode = (value as string).split('_');
                               const ep: EpisodeItem = data.episodes[data.season_id].find((e: EpisodeItem) => parseInt(e.episode) === parseInt(episode[1]));
                               setEpisode(ep)
                           }}/>
                    : null}
                {Object.keys(data.streams || {}).length ?
                    <Input label={'Quality'} type="select"
                           options={Object.keys(data.streams).map(key => ({
                               label: key,
                               value: key
                           }))} value={quality}
                           onChange={({value}) => {
                               setQuality(value as keyof Streams)
                           }}/> : null}
                <Player episode_id={data.episode_id}
                        season_id={data.season_id}
                        quality={quality}
                        translation_id={data.translation_id}
                        episodes={data.episodes}
                        url={url}
                        streams={data.streams as Streams}
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

export default MoviePage;