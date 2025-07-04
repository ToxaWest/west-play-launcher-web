import styles from "./media.module.scss";
import React, {useEffect} from "react";
import Hls from "hls.js";
import video from "../Video";
import Loader from "../Loader";
import movieStorage from "./movieStorage";

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
                }) => {
    const playerRef = React.useRef(null);

    const getStartPosition = () => {
        const s = movieStorage.getHistory(url)
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
        "maxMaxBufferLength": 600,
        "maxBufferSize": 33554432000
    }));
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        hlsRef.current.attachMedia(playerRef.current);
    }, []);

    useEffect(() => {
        initPlayer()
    }, [episodes, quality])


    const sortStreams = (streams) => {
        const res = {};
        streams.forEach(s => {
            const type = s.split('.').at(-1);
            if (!res.hasOwnProperty(type)) res[type] = [];
            res[type].push(s)
        })
        return res
    }

    const initPlayer = () => {
        if (!playerRef.current) return;
        if (!streams) return;
        if (!streams[quality]) {
            if (Object.keys(streams).length > 0) {
                setQuality(Object.keys(streams).at(-1));
            }
            return;
        }
        setLoading(true)
        const {m3u8, mp4} = sortStreams(streams[quality])
        const h = [m3u8[0]];
        hlsRef.current.loadSource(m3u8[0]);
        hlsRef.current.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                if (h.includes(data.url)) {
                    const m3uSource = m3u8.find(s => !h.includes(s))
                    if (m3uSource) {
                        h.push(m3uSource);
                        hlsRef.current.loadSource(m3uSource);
                    } else {
                        const qList = Object.keys(streams);
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
                    e.target.paused ? e.target.play() : e.target.pause()
                }}
                autoPlay={false}
                onLoadedData={(e) => {
                    setLoading(false);
                    document.getElementById('playButton').style.display = 'block';
                    const progressBar = document.getElementById('progressBar');
                    progressBar.value = e.target.currentTime;
                    progressBar.max = e.target.duration;
                }}
                onPlay={() => {
                    playerRef.current.autoplay = false;
                    document.getElementById('playButton').style.display = 'none';
                }}
                onTimeUpdate={(e) => {
                    const progressBar = document.getElementById('progressBar');
                    progressBar.value = e.target.currentTime;
                    if (e.target.currentTime) {
                        movieStorage.update({
                            url,
                            episode_id: episode_id,
                            season_id: season_id,
                            translation_id: translation_id,
                            currentTime: e.target.currentTime
                        })
                    }
                }}
                onPause={() => {
                    document.getElementById('playButton').style.display = 'block';
                }}
                onEnded={() => {
                    if (episodes.hasOwnProperty(season_id)) {
                        const nS = episodes[season_id].find(b => parseInt(b.episode) === (episode_id + 1) && parseInt(b.season) === season_id)
                        if (nS) {
                            setQuality('1080p Ultra')
                            setEpisode(nS);
                            playerRef.current.autoplay = true;
                            return;
                        } else {
                            if (episodes.hasOwnProperty(season_id + 1)) {
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
                }}/>
            <div className={styles.playButton} id={'playButton'} onClick={() => {
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