import {useEffect, useRef} from "react";
import videojs from "video.js";

const VideoComponent = ({selected, options, soundStatus}) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        setPlayerData()
    }, [selected])

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.muted(!soundStatus)
        }
    }, [soundStatus]);

    const setPlayerData = () => {
        if (playerRef.current) {
            const {src, poster} = getData(selected);
            playerRef.current.poster(poster)
            playerRef.current.src(src)
        }
    }

    const getData = (data) => {
        const {type, thumbnail} = data;
        if (data.webm) {
            return {
                poster: thumbnail,
                src: [{src: data.mp4.max, type: "video/mp4",}, {src: data.webm.max, type: "video/webm",}]
            }
        }

        if (type === 'epicHosted') {
            const [videos] = Object.values(JSON.parse(data.recipes));
            return {
                poster: videos[0].outputs.find(({key}) => key === 'thumbnail').url,
                src: videos.map(v => {
                    const {url, contentType} = v.outputs.find(({key}) => key === 'manifest')
                    return {src: url, type: contentType}
                })
            }
        }

        if (type === 'egsV2') {
            return {
                poster: data.poster,
                src: data.src
            }
        }

        if (type === 'upload') {
            return {
                poster: null,
                src: [{src: data.path + data.publicId, type: 'video/mp4'}],
            }
        }

        if (data.playbackURLs) {
            const getType = (t) => {
                if (t === 'M3U8') {
                    return 'application/x-mpegURL'
                }
                return 'video/' + t
            }
            return {
                poster: data.thumbnail.url,
                src: data.playbackURLs.map(({url, videoMimeType}) => ({src: url, type: getType(videoMimeType)}))
            }
        }

        return {}
    }

    useEffect(() => {
        if (videoRef.current) {
            playerRef.current = videojs(videoRef.current, {width: window.innerWidth});
            setPlayerData()
        }
    }, [])

    if (selected.provider) {
        if (selected.provider === "youtube") {
            return <iframe width={window.innerWidth} height={window.innerWidth / (16 / 9)}
                           src={`https://www.youtube.com/embed/${selected.videoId}?autoplay=${soundStatus ? 1 : 0}&loop=1&rel=0&mute=1`}
                           frameBorder="0"/>
        }
        if (selected.provider === 'wistia') {
            return <iframe width={window.innerWidth} height={window.innerWidth / (16 / 9)}
                           src={`https://fast.wistia.net/embed/iframe/${selected.videoId}`}
                           frameBorder="0"/>
        }
    }

    return (
        <div>
            <video ref={videoRef} {...options}/>
        </div>
    );
};

export default VideoComponent