import {useState} from "react";
import {
    EpisodeItem,
    Episodes,
    moviePartContentType,
    movieScheduleType,
    movieTranslationItem,
    movieType,
    Streams
} from "@type/electron.types";

import movieStorage from "../components/Media/movieStorage";
import electronConnector from "../helpers/electronConnector";
import i18n from "../helpers/translate";


const useMovie = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [quality, setQuality] = useState<keyof Streams>('1080p Ultra')
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
            streams: null,
            translations: []
        }
    )

    const init = (url: string) => {
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
    }

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
            const {episode_id, season_id} = Object.values(r.episodes).reduce((acc, cur) => {
                const current = cur.find(a => a.current);
                if (current) {
                    acc.episode_id = parseInt(current.episode);
                    acc.season_id = parseInt(current.season);
                }
                return acc;
            }, {episode_id: 0, season_id: 0})
            setData((d) => ({
                ...d,
                episode_id,
                episodes: r.episodes,
                season_id,
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

    const getEpisodes = (): EpisodeItem[] => {
        if (data.episodes[data.season_id]) return data.episodes[data.season_id]
        return null
    }

    const inputFields = [
        ...(data.translations.length ? [{
            label: i18n.t('Translation'),
            onChange: ({value}) => setTranslation(value),
            options: data.translations.map(t => ({html: t.html, label: t.title, value: t.id})),
            type: 'select',
            value: data.translation_id
        }] : []),
        ...(Object.keys(data.episodes).length ? [{
            label: i18n.t('Season'),
            onChange: ({value}) => {
                if (parseInt(value) === data.season_id) return;
                setData((d) => {
                    return {...d, episode_id: null, season_id: parseInt(value as string)}
                })
            },
            options: Object.keys(data.episodes).map(key => ({label: key, value: parseInt(key)})),
            type: 'select',
            value: data.season_id
        }] : []),
        ...(getEpisodes() ? [{
            label: i18n.t('Episode'),
            onChange: ({value}) => {
                if (!value) return;
                const episode = (value as string).split('_');
                const ep: EpisodeItem = data.episodes[data.season_id].find((e: EpisodeItem) => parseInt(e.episode) === parseInt(episode[1]));
                setEpisode(ep)
            },
            options: getEpisodes().map((item: EpisodeItem) => ({
                label: item.text,
                value: item.season + '_' + item.episode
            })),
            type: 'select',
            value: data.season_id + '_' + data.episode_id
        }] : []),
        ...(Object.keys(data.streams || {}).length ? [{
            label: i18n.t('Quality'),
            onChange: ({value}) => {
                setQuality(value as keyof Streams)
            },
            options: Object.keys(data.streams).map(key => ({label: key, value: key})),
            type: 'select',
            value: quality
        }] : [])
    ] as {
        label: string,
        onChange: (data: { name: string, value?: string | number }) => void,
        options: { label: string, value: string }[],
        type: 'select',
        value: string | number
    }[]

    return {
        data,
        init,
        inputFields,
        loading,
        quality,
        setEpisode,
        setQuality,
        setTranslation
    }
}

export default useMovie;