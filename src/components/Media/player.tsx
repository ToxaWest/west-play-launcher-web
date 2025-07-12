import React, {useEffect} from "react";
import type {EpisodeItem, Episodes, Streams} from "@type/electron.types";
import type {MovieStorageHistory} from "@type/movieStorage.types";
import Hls from "hls.js";

import Loader from "../Loader";

import movieStorage from "./movieStorage";

import styles from "./media.module.scss";

const Player = ({
                    streams,
                    episodes,
                    season_id,
                    episode_id,
                    translation_id,
                    url,
                    setEpisode,
                    quality,
                    setQuality
                }: {
    streams: Streams,
    season_id: number,
    episode_id: number,
    episodes: Episodes,
    translation_id: string
    url: string,
    setEpisode: (episode: EpisodeItem) => void,
    quality: keyof Streams,
    setQuality: (quality: keyof Streams) => void
}) => {
    const playerRef = React.useRef(null);

    const getStartPosition = () => {
        const s = movieStorage.getHistory(url) as MovieStorageHistory;
        if (s.translation_id === translation_id) {
            if (episode_id && season_id) {
                if (episode_id === s.episode_id && season_id === s.season_id)
                    return s.currentTime || 0
            } else
                return s.currentTime || 0
        }
        return 0
    }

    useEffect(() => {
        playerRef.current.currentTime = getStartPosition();
    }, [episode_id, season_id, translation_id])

    const hlsRef = React.useRef(new Hls({
        manifestLoadingTimeOut: 2000,
        "maxBufferLength": 180,
        "maxBufferSize": 33554432000,
        "maxMaxBufferLength": 600
    }));
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        hlsRef.current.attachMedia(playerRef.current);
    }, []);

    useEffect(() => {
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
                }}
                onPlay={() => {
                    playerRef.current.autoplay = false;
                    document.getElementById('playButton').style.display = 'none';
                }}
                onTimeUpdate={(e) => {
                    const progressBar = document.getElementById('progressBar') as HTMLInputElement;
                    progressBar.value = (e.target as HTMLVideoElement).currentTime.toString();
                    if ((e.target as HTMLVideoElement).currentTime) {
                        movieStorage.update({
                            currentTime: (e.target as HTMLVideoElement).currentTime,
                            episode_id: episode_id,
                            season_id: season_id,
                            translation_id: translation_id,
                            url
                        })
                    }
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
            </video>
            <div className={styles.playButton} role="button" tabIndex={0} id={'playButton'} onClick={() => {
                playerRef.current.play()
            }}/>
            <input type="range" id={'progressBar'} disabled={loading} className={styles.progress} step={1}
                   onChange={(e) => {
                       playerRef.current.currentTime = parseInt(e.target.value);
                   }}/>
            <Loader loading={loading}/>
        </div>

    )
}

export default Player