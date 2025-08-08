import React from "react";
import usePlayer from "@hook/usePlayer";
import type {EpisodeItem, Episodes, Streams} from "@type/electron.types";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";

import styles from "./media.module.scss";

const Player = ({
                    thumbnails,
                    streams,
                    episodes,
                    season_id,
                    episode_id,
                    translation_id,
                    setEpisode,
                    quality,
                    id,
                    subtitle,
                    setQuality
                }: {
    subtitle?: string,
    id: number,
    streams: Streams,
    thumbnails?: string,
    season_id: number,
    episode_id: number,
    episodes: Episodes,
    translation_id: string
    setEpisode: (episode: EpisodeItem) => void,
    quality: keyof Streams,
    setQuality: (quality: keyof Streams) => void
}) => {
    const playerRef = React.useRef<HTMLVideoElement>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const timerKey = `${id}_${translation_id}_${season_id}_${episode_id}`

    usePlayer({playerRef, quality, setQuality, streams, subtitle, thumbnails, timerKey, wrapperRef});

    return (
        <div style={{position: 'relative', zIndex: 0}} ref={wrapperRef}>
            <video
                className={styles.player}
                ref={playerRef}
                onPlay={() => {
                    playerRef.current.autoplay = false;
                    if (getFromStorage('movies').authorized) electronConnector.setSave({
                        episode: episode_id,
                        post_id: id,
                        season: season_id,
                        translator_id: parseInt(translation_id)
                    })
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
                }}
            >
                <track kind="captions"/>
            </video>
        </div>

    )
}

export default Player