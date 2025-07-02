import styles from "./media.module.scss";
import React, {useEffect} from "react";
import Hls from "hls.js";
import video from "../Video";

const Player = ({streams, episodes, season_id, episode_id, translation_id, setEpisode, quality, setQuality, ref}) => {
    const playerRef = ref || React.useRef(null);
    const hlsRef = React.useRef(new Hls());

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
        return res;
    }

    const initPlayer = () => {
        if (!playerRef.current) return;
        if (!streams[quality]) {
            if (Object.keys(streams).length > 0) {
                setQuality(Object.keys(streams).at(-1));
            }
            return;
        }
        const {m3u8, mp4} = sortStreams(streams[quality])
        const h = [m3u8[0]];
        hlsRef.current.loadSource(m3u8[0]);
        hlsRef.current.on(Hls.Events.ERROR, function (event, data) {
            console.log("Hls.Events.ERROR", data);
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

    return (
        <video
            className={styles.player}
            controls={true}
            ref={playerRef}
            autoPlay={true}
            onPlay={() => {

            }}
            onEnded={() => {
                if (episodes.hasOwnProperty(season_id)) {
                    const nS = episodes[season_id].find(b => parseInt(b.episode) === (episode_id + 1) && parseInt(b.season) === season_id)
                    if (nS) setEpisode(nS)
                }

            }}/>
    )
}

export default Player