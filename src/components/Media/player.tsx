import React from "react";
import type {EpisodeItem, Episodes, Streams} from "@type/electron.types";
import Hls from "hls.js";

import Loader from "../Loader";

import styles from "./media.module.scss";

const Player = ({
                    streams,
                    episodes,
                    season_id,
                    episode_id,
                    translation_id,
                    setEpisode,
                    quality,
                    subtitle,
                    setQuality
                }: {
    subtitle?: string,
    streams: Streams,
    season_id: number,
    episode_id: number,
    episodes: Episodes,
    translation_id: string
    setEpisode: (episode: EpisodeItem) => void,
    quality: keyof Streams,
    setQuality: (quality: keyof Streams) => void
}) => {
    const playerRef = React.useRef<HTMLVideoElement>(null);
    const timeRef = React.useRef<HTMLDivElement>(null);
    const getStartPosition = () => {

        return 0
    }

    React.useEffect(() => {
        if (playerRef.current) {
            playerRef.current.currentTime = getStartPosition();
        }
    }, [episode_id, season_id, translation_id])

    const hlsRef = React.useRef(new Hls({
        manifestLoadingTimeOut: 2000,
        "maxBufferLength": 180,
        "maxBufferSize": 33554432000,
        "maxMaxBufferLength": 600
    }));
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        hlsRef.current.attachMedia(playerRef.current);
        return () => {
            hlsRef.current.destroy();
        }
    }, []);

    React.useEffect(() => {
        initPlayer()
    }, [episodes, quality])

    const sortStreams = (streams: string[]): { mp4: string[], m3u8: string[] } => {
        const res = {m3u8: [], mp4: []};
        streams.forEach(s => {
            const type = s.split('.').at(-1) as 'mp4' | 'm3u8';
            if (!Object.hasOwn(res, type)) res[type] = [];
            res[type].push(s)
        })
        return res
    }

    const subtitles = () => {
        const sub = [];
        if(!subtitle) return sub;
        subtitle.split(',').forEach(s => {
            const [lang, url] = s.split(']');
            sub.push({lang: [lang.replace('[', '')], url})
        })
        return sub
    }

    const initPlayer = () => {
        if (!playerRef.current) return;
        if (!streams) return;
        if (!streams[quality]) {
            if (Object.keys(streams).length > 0) {
                setQuality((Object.keys(streams) as (keyof Streams)[]).at(-1));
            }
            return;
        }
        setLoading(true)
        const {m3u8} = sortStreams(streams[quality])
        const h = [m3u8[0]];
        hlsRef.current.loadSource(m3u8[0]);
        hlsRef.current.on(Hls.Events.ERROR, function (_event, data) {
            if (data.fatal) {
                if (h.includes(data.url)) {
                    const m3uSource = m3u8.find(s => !h.includes(s))
                    if (m3uSource) {
                        h.push(m3uSource);
                        hlsRef.current.loadSource(m3uSource);
                    } else {
                        const qList = Object.keys(streams) as (keyof Streams)[];
                        const curr = qList.indexOf(quality);
                        if (curr - 1 >= 0) setQuality(qList[curr - 1])
                        return;
                    }
                }
                hlsRef.current.startLoad();
            }
        });
    }

    if (!streams) return;

    const timeFix = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        // Pad with leading zeros if necessary
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    const updateTime = (target: HTMLVideoElement) => {
        const curr = timeFix(target.currentTime || 0);
        const duration = timeFix(target.duration || 0);
        if (timeRef.current) {
            timeRef.current.innerText = `${curr} / ${duration}`;
        }
    }

    return (
        <div style={{position: 'relative'}}>
            <video
                className={styles.player}
                id={'hlsPlayer'}
                controls={false}
                ref={playerRef}
                onClick={e => {
                    (e.target as HTMLVideoElement).paused ? (e.target as HTMLVideoElement).play() : (e.target as HTMLVideoElement).pause()
                }}
                autoPlay={false}
                onLoadedData={(e) => {
                    setLoading(false);
                    document.getElementById('playButton').style.display = 'block';
                    const progressBar = document.getElementById('progressBar') as HTMLInputElement;
                    progressBar.value = (e.target as HTMLVideoElement).currentTime.toString();
                    progressBar.max = (e.target as HTMLVideoElement).duration.toString();
                    updateTime(e.target as HTMLVideoElement);
                }}
                onPlay={() => {
                    playerRef.current.autoplay = false;
                    document.getElementById('playButton').style.display = 'none';
                }}
                onCanPlay={() => {
                    setLoading(false);
                }}
                onTimeUpdate={(e) => {
                    updateTime(e.target as HTMLVideoElement);
                    const progressBar = document.getElementById('progressBar') as HTMLInputElement;
                    progressBar.value = (e.target as HTMLVideoElement).currentTime.toString();
                }}
                onPause={() => {
                    document.getElementById('playButton').style.display = 'block';
                }}
                onEnded={() => {
                    if (Object.hasOwn(episodes, season_id)) {
                        const nS = episodes[season_id].find(b => parseInt(b.episode) === (episode_id + 1) && parseInt(b.season) === season_id)
                        if (nS) {
                            setQuality('1080p Ultra')
                            setEpisode(nS);
                            playerRef.current.autoplay = true;
                            return;
                        } else {
                            if (Object.hasOwn(episodes, season_id + 1)) {
                                const nSe = episodes[season_id + 1].find(b => parseInt(b.episode) === 1)
                                if (nSe) {
                                    setQuality('1080p Ultra')
                                    setEpisode(nSe);
                                    playerRef.current.autoplay = true;
                                    return;
                                }
                            }
                        }
                    }
                    if (document.fullscreenElement) document.exitFullscreen();
                }}>
                <track kind="captions"/>
                {subtitles().map(({lang, url}) => {
                    return <track
                        key={lang}
                        label={lang}
                        kind="subtitles"
                        srcLang="en"
                        src={url}
                    />
                })}
            </video>
            <div className={styles.playButton} role="button" tabIndex={0} id={'playButton'} onClick={() => {
                playerRef.current.play()
            }}/>
            <input type="range" id={'progressBar'} disabled={loading} className={styles.progress} step={1}
                   onChange={(e) => {
                       setLoading(true)
                       playerRef.current.currentTime = parseInt(e.target.value);
                   }}/>
            <div ref={timeRef} style={{textAlign: "right"}}/>
            <Loader loading={loading}/>
        </div>

    )
}

export default Player