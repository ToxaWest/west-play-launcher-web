import React, {useEffect, useState} from "react";
import useMovie from "@hook/useMovie";
import {Streams} from "@type/electron.types";
import {createSearchParams, useNavigate} from "react-router-dom";

import i18n from "../../helpers/translate";
import Input from "../Input";
import Loader from "../Loader";

import movieStorage from "./movieStorage";
import Player from "./player";

const MoviePage = ({url}: {
    url: string
}) => {
    const [showTrailer, setShowTrailer] = useState(false)
    const [isFavorites, setIsFavorites] = useState<boolean>(movieStorage.isFavorites(url))

    const {
        data,
        loading,
        init,
        setEpisode,
        inputFields,
        quality,
        setQuality
    } = useMovie();
    const navigate = useNavigate();

    useEffect(() => {
        const redirectTo = (target: HTMLElement) => {
            const href = target.getAttribute('href')
            if (target.getAttribute('target') === '_blank') return;
            if (href) navigate(href)
        }
        const listener = (e: PointerEvent) => {
            e.preventDefault()
            e.stopPropagation()
            const target = e.target as HTMLElement;
            if (target.tagName === 'A') {
                redirectTo(target);
            } else if (target.parentElement.tagName === 'A') {
                redirectTo(target.parentElement);
            }
        }
        // eslint-disable-next-line @eslint-react/web-api/no-leaked-event-listener
        document.getElementById('movieTable').addEventListener('click', listener);
        return () => {
            if (document.getElementById('movieTable')) {
                document.getElementById('movieTable').removeEventListener('click', listener);
            }
        }
    }, [])

    useEffect(() => {
        init(url)
    }, [url])


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
                    className="w-full aspect-video"
                    src={`https://www.youtube.com/embed/${id}?iv_load_policy=3&autoplay=1&loop=1&rel=0&mute=1&showinfo=0`}
                />
            )
        }
        return null
    }

    const renderTable = () => {
        if (!data.movie.table) return null
        return (
            <tbody className="bg-theme-transparent">
            {data.movie.table.map(item =>
                <tr key={item.title}>
                    <td className="border border-theme p-gap-half">{item.title}</td>
                    <td className="border border-theme p-gap-half" dangerouslySetInnerHTML={{__html: item.value}}/>
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
                    <table className="w-full border-collapse bg-theme-transparent">
                        <tbody>
                        {item.data.map(a => <tr key={a.id}>
                            <td className="border border-theme p-gap-half">{a.episode}</td>
                            <td className="border border-theme p-gap-half" dangerouslySetInnerHTML={{__html: a.title}}/>
                            <td className="border border-theme p-gap-half">{a.date}</td>
                            <td className="border border-theme p-gap-half" dangerouslySetInnerHTML={{__html: a.exist}}/>
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
            <table className="border-collapse bg-theme-transparent">
                <tbody>
                {data.partContent.map(item => (
                    <tr key={item.id}
                        tabIndex={item.url ? 1 : 0}
                        role="button"
                        className={`transition-colors ${item.url ? 'cursor-pointer hover:bg-text hover:text-theme focus:bg-text focus:text-theme active:bg-text active:text-theme' : 'text-text-secondary'}`}
                        onClick={() => {
                            if (item.url) navigate({
                                pathname: '/movie',
                                search: `?${createSearchParams({url: item.url})}`,
                            })
                        }}
                    >
                        <td className="border border-theme p-gap-half">{item.id}</td>
                        <td className="border border-theme p-gap-half">{item.title}</td>
                        <td className="border border-theme p-gap-half">{item.year}</td>
                        <td className="border border-theme p-gap-half">{item.rating}</td>
                    </tr>))}
                </tbody>
            </table>
        )
    }

    return (
        <div className="max-w-[90vw] my-[50px] mx-auto grid grid-cols-[3fr_2fr] gap-gap p-theme bg-theme-transparent">
            <div className="grid grid-cols-[1fr_2.5fr] gap-gap-half">
                {data.movie.image ? <img src={data.movie.image} alt={data.movie.title} className="w-full min-w-0"/> : null}
                <div className="flex flex-col gap-gap p-gap bg-theme-transparent [&_h1]:m-0 [&_h3]:m-0 [&_table_span[data-url]]:text-text-secondary [&_table_span[data-url]]:cursor-pointer hover:[&_table_span[data-url]]:underline">
                    <h1>{data.movie.title}</h1>
                    <h3>{data.movie.originalTitle}</h3>
                    <p>{data.movie.description}</p>
                    <table id={'movieTable'} className="border-collapse bg-theme-transparent">
                        {renderTable()}
                    </table>
                </div>
            </div>
            <div className="flex flex-col gap-gap">
                {inputFields.map(item => <Input key={item.label} {...item}/>)}
                {data.streams ? <Player
                    thumbnails={data.thumbnails}
                    episode_id={data.episode_id}
                    season_id={data.season_id}
                    quality={quality}
                    id={data.post_id}
                    translation_id={data.translation_id}
                    episodes={data.episodes}
                    subtitle={data.subtitle}
                    streams={data.streams as Streams}
                    setEpisode={setEpisode}
                    setQuality={setQuality}
                /> : null}
            </div>
            <div className="flex flex-col gap-gap-half">
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