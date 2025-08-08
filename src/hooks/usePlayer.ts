import 'shaka-player/dist/controls.css'

import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {Streams} from "@type/electron.types";
// @ts-ignore
import shaka from "shaka-player/dist/shaka-player.ui";

import movieStorage from "../components/Media/movieStorage";
import i18n from "../helpers/translate";

const usePlayer = ({playerRef, timerKey, streams, quality, setQuality, thumbnails, subtitle, wrapperRef}) => {
    const {setFooterActions, removeFooterActions} = useFooterActions()
    const shakaRef = React.useRef(new shaka.Player())
    const uiRef = React.useRef(null)

    const sortStreams = (streams: string[]): { mp4: string[], m3u8: string[] } => streams.reduce((acc, s) => {
        const type = s.split('.').at(-1) as 'mp4' | 'm3u8';
        if (Object.hasOwn(acc, type)) acc[type].push(s)
        return acc
    }, {m3u8: [], mp4: []})

    React.useEffect(() => {
        shakaRef.current.attach(playerRef.current);
        const a = new shaka.ui.Overlay(
            shakaRef.current,
            wrapperRef.current,
            playerRef.current,
        );

        a.configure({overflowMenuButtons: ["captions", "chapter", "playback_rate"]})
        uiRef.current = a.getControls();

        document.addEventListener('fullscreenchange', () => {
            if (uiRef.current.isFullScreenEnabled()) {
                setFooterActions({
                    a: {
                        button: 'a',
                        onClick: () => playerRef.current.paused ? playerRef.current.play() : playerRef.current.pause(),
                        title: i18n.t('Select')
                    },
                    b: {
                        button: 'b',
                        onClick: () => uiRef.current.toggleFullScreen().then(() => {
                            playerRef.current.pause()
                        }),
                        title: i18n.t('Back')
                    }
                })
            } else {
                removeFooterActions(['a', 'b']);
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
                onClick: () => uiRef.current.toggleFullScreen(),
                title: i18n.t('FullScreen')
            }
        })
        return () => {
            removeFooterActions(['lt', 'rt', 'x', 'y', 'b', 'a']);
        }
    }, [])
    const subtitles = () => {
        const sub = [];
        if (!subtitle) return sub;
        return subtitle.split(',').map((s: string) => s.match(/\[(.*)](.*)/))
    }

    const load = (url: string, h: string[], m3u8: string[]) => {
        shakaRef.current.load(url)
            .then(() => {
                for (const sub of subtitles()) {
                    shakaRef.current.addTextTrackAsync(sub[2], sub[1], 'subtitles', 'text/vtt', '', sub[1])
                }
                return shakaRef.current.addThumbnailsTrack(thumbnails, 'text/vtt');
            }).catch(() => {
                if (h.includes(url)) {
                    const m3uSource = m3u8.find(s => !h.includes(s))
                    if (m3uSource) {
                        h.push(m3uSource);
                        load(m3uSource, h, m3u8);
                    } else {
                        const qList = Object.keys(streams) as (keyof Streams)[];
                        const curr = qList.indexOf(quality);
                        if (curr - 1 >= 0) setQuality(qList[curr - 1])
                        return;
                    }
                }
            }
        )
    }

    React.useEffect(() => {
        if (!streams[quality]) {
            if (Object.keys(streams).length > 0) setQuality((Object.keys(streams) as (keyof Streams)[]).at(-1));
            return;
        }
        const {m3u8} = sortStreams(streams[quality])
        const h = [m3u8[0]];
        load(m3u8[0], h, m3u8)
        playerRef.current.currentTime = movieStorage.getTime(timerKey)
        playerRef.current.ontimeupdate = () => {
            movieStorage.setTime(timerKey, playerRef.current.currentTime)
        }

    }, [timerKey, quality])

    return {}
}

export default usePlayer;