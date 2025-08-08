import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {Streams} from "@type/electron.types";
import Hls from "hls.js";

import movieStorage from "../components/Media/movieStorage";
import i18n from "../helpers/translate";

const usePlayer = ({playerRef, timerKey, streams, quality, setQuality, thumbnails, subtitle}) => {
    const {setFooterActions, removeFooterActions} = useFooterActions()
    const [loading, setLoading] = React.useState(false);

    const hlsRef = React.useRef(new Hls({
        manifestLoadingTimeOut: 2000,
        "maxBufferLength": 180,
        "maxBufferSize": 33554432000,
        "maxMaxBufferLength": 600
    }));
    const sortStreams = (streams: string[]): { mp4: string[], m3u8: string[] } => streams.reduce((acc, s) => {
        const type = s.split('.').at(-1) as 'mp4' | 'm3u8';
        if (Object.hasOwn(acc, type)) acc[type].push(s)
        return acc
    }, {m3u8: [], mp4: []})

    React.useEffect(() => {
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                setFooterActions({
                    a: {
                        button: 'a',
                        onClick: () => playerRef.current.paused ? playerRef.current.play() : playerRef.current.pause(),
                        title: i18n.t('Select')
                    },
                    b: {
                        button: 'b',
                        onClick: () => document.exitFullscreen().then(() => {
                            playerRef.current.pause()
                        }),
                        title: i18n.t('Back')
                    },
                    y: {
                        button: 'y',
                        onClick: () => document.exitFullscreen().then(() => {
                            playerRef.current.pause();
                        }),
                        title: i18n.t('FullScreen')
                    }
                })
            } else {
                removeFooterActions(['a', 'b']);
                setFooterActions({
                    y: {
                        button: 'y',
                        onClick: () => playerRef.current.requestFullscreen().then(() => {
                            playerRef.current.play();
                        }),
                        title: i18n.t('FullScreen')
                    }
                })
            }
        });
        setFooterActions({
            lt: {
                button: 'lt',
                onClick: () => playerRef.current.currentTime += -15,
                title: i18n.t('Forward') + ' -'
            },
            rt: {
                button: 'rt',
                onClick: () => playerRef.current.currentTime += 15,
                title: i18n.t('Forward') + ' +'
            },
            x: {
                button: 'x',
                onClick: () => playerRef.current.paused ? playerRef.current.play() : playerRef.current.pause(),
                title: i18n.t('Play/Pause')
            },
            y: {
                button: 'y',
                onClick: () => playerRef.current.requestFullscreen().then(() => {
                    playerRef.current.play();
                }),
                title: i18n.t('FullScreen')
            }
        })
        return () => {
            hlsRef.current.destroy();
            removeFooterActions(['lt', 'rt', 'x', 'y', 'b', 'a']);
        }
    }, [])

    React.useEffect(() => {
        const player: HTMLVideoElement = playerRef.current;
        if (!streams[quality]) {
            if (Object.keys(streams).length > 0) setQuality((Object.keys(streams) as (keyof Streams)[]).at(-1));
            return;
        }

        hlsRef.current.attachMedia(player);
        setLoading(true);
        const {m3u8} = sortStreams(streams[quality])
        const h = [m3u8[0]];
        hlsRef.current.loadSource(m3u8[0]);
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, function () {
            hlsRef.current.startLoad();
        });
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
            }
        });
        hlsRef.current.allSubtitleTracks.forEach(t => {
            console.log(t)
        })
        player.currentTime = movieStorage.getTime(timerKey)
        player.ontimeupdate = () => {
            movieStorage.setTime(timerKey, player.currentTime)
        }
        player.oncanplay = () => {
            console.log('canplay')
            setLoading(false);
        }
    }, [timerKey, quality])

    return {
        loading
    }
}

export default usePlayer;