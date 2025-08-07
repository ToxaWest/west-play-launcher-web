import React, {useEffect, useState} from "react";
import useFooterActions from "@hook/useFooterActions";
import {
    EpisodeItem,
    Episodes,
    moviePartContentType, movieScheduleType,
    movieTranslationItem,
    movieType,
    Streams
} from "@type/electron.types";
import {createSearchParams, useNavigate} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
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
    const [isFavorites, setIsFavorites] = useState<boolean>(movieStorage.isFavorites(url))
    const navigate = useNavigate();
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
                title: i18n.t('Select')
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
                title: i18n.t('Back')
            },
            lt: {
                button: 'lt',
                onClick: () => forward(-15),
                title: i18n.t('Forward') + ' -'
            },
            rt: {
                button: 'rt',
                onClick: () => forward(15),
                title: i18n.t('Forward') + ' +'
            },
            x: {
                button: 'x',
                onClick: () => {
                    const player = document.querySelector('#hlsPlayer') as HTMLVideoElement;
                    if (player) {
                        player.paused ? player.play() : player.pause()
                    }
                },
                title: i18n.t('Play/Pause')
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
                title: i18n.t('FullScreen')
            }
        })
        return () => {
            removeFooterActions(['lt', 'rt', 'x', 'y', 'b', 'a']);
        }
    }, [])
    const [data, setData] = useState<{
        trailer?: string,
        type?: 'initCDNMoviesEvents' | 'initCDNSeriesEvents',
        movie?: movieType,
        translations: movieTranslationItem[],
        translation_id?: string
        streams?: Streams | {}
        episodes?: Episodes | {}
        schedule?: movieScheduleType[]
        partContent?: moviePartContentType[]
        subtitle?: string
        thumbnails?: string,
        trl_favs?: string
        post_id?: number
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
                partContent: r.partContent,
                post_id: parseInt(r.post_id),
                schedule: r.schedule,
                season_id: parseInt(r.season_id),
                streams: r.streams,
                subtitle: r.subtitle,
                thumbnails: r.thumbnails,
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
    }, [url])

    const setTranslation = (translation_id: string) => {
        setLoading(true);
        electronConnector.getAjaxVideo({
            data: {
                action: data.type === "initCDNMoviesEvents" ? 'get_movie' : 'get_episodes',
                favs: data.trl_favs,
                id: data.post_id,
                translator_id: parseInt(translation_id)
            },
            method: 'get_cdn_series'
        }).then(r => {
            setData((d) => ({
                ...d,
                episodes: r.episodes,
                streams: r.streams,
                subtitle: r.subtitle,
                thumbnails: r.thumbnails,
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
                    subtitle: r.subtitle,
                    thumbnails: r.thumbnails,
                    translation_id: translator_id
                }
            })
            setLoading(false);
        })
    }

    const renderTrailer = () => {
        if (!data.trailer) return null
        if (!showTrailer) {
            return <button tabIndex={1} type="button"
                           onClick={() => setShowTrailer(true)}>{i18n.t('Show trailer')}</button>
        }
        const url = new URL(data.trailer);
        if (url.hostname.includes('youtube')) {
            const id = url.pathname.split('/').at(-1);
            return (
                <iframe
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
                    <td dangerouslySetInnerHTML={{
                        __html: item.value
                            .replaceAll('tabindex="1"', '')
                            .replaceAll('button', 'span')
                    }}/>
                </tr>
            )}
            </tbody>
        )
    }

    const renderFavorites = () => {
        return (
            <button tabIndex={1} type="button" onClick={() => {
                if (isFavorites) movieStorage.removeFromFavorites(url)
                else movieStorage.addToFavorites({image: data.movie.image, subtitle: '', title: data.movie.title, url})
                setIsFavorites(movieStorage.isFavorites(url))
            }}>{isFavorites ?
                i18n.t('Remove from favorites') :
                i18n.t('Add to favorites')}
            </button>
        )
    }

    const renderSchedule = () => {
        if (!data.schedule) return null

        return (<ul>
            {data.schedule.map(item => (
                <li key={item.title}>
                    <h3>{item.title}</h3>
                    <table style={{width: '100%'}}>
                        <tbody>
                        {item.data.map(a => <tr key={a.id}>
                            <td>{a.episode}</td>
                            <td dangerouslySetInnerHTML={{__html: a.title}}/>
                            <td>{a.date}</td>
                            <td dangerouslySetInnerHTML={{__html: a.exist}}/>
                        </tr>)}
                        </tbody>
                    </table>
                </li>
            ))}
        </ul>)
    }

    const renderPartContent = () => {
        if (!data.partContent) return null

        return (
            <table>
                <tbody>
                {data.partContent.map(item => (
                    <tr key={item.title}
                        tabIndex={item.url ? 1 : 0}
                        role="button"
                        style={{color: item.url ? 'inherit' : 'var(--theme-text-color-seconary)', cursor: 'pointer'}}
                        onClick={() => {
                            if (item.url) navigate({
                                pathname: '/movie',
                                search: `?${createSearchParams({url: item.url})}`,
                            })
                        }}
                    >
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.year}</td>
                        <td>{item.rating}</td>
                    </tr>))}
                </tbody>
            </table>
        )
    }

    return (
        <div className={styles.wrapperMovie}>
            <div className={styles.description}>
                {data.movie.image ? <img src={data.movie.image} alt={data.movie.title}/> : null}
                <div className={styles.descriptionContent}>
                    <h1>{data.movie.title}</h1>
                    <h3>{data.movie.originalTitle}</h3>
                    <p>{data.movie.description}</p>
                    <table id={'movieTable'}>
                        {renderTable()}
                    </table>
                </div>
            </div>
            <div className={styles.optionsWrapper}>
                {data.translations.length ?
                    <Input label={i18n.t('Translation')}
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
                    <Input label={i18n.t('Season')} type="select"
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
                    <Input label={i18n.t('Episode')} type="select"
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
                    <Input label={i18n.t('Quality')} type="select"
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
                        id={data.post_id}
                        translation_id={data.translation_id}
                        episodes={data.episodes}
                        subtitle={data.subtitle}
                        streams={data.streams as Streams}
                        setEpisode={setEpisode}
                        setQuality={setQuality}
                />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--gap-half)'}}>
                {renderFavorites()}
                {renderTrailer()}
                {renderPartContent()}
            </div>
            {renderSchedule()}
            <Loader loading={loading}/>
        </div>
    )
}

export default MoviePage;