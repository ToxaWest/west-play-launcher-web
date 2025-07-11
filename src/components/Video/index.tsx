import React from "react";

import electronConnector from "../../helpers/electronConnector";
import type {GameVideoType} from "../../types/game.types";
import Loader from "../Loader";

const VideoComponent = ({selected, options, soundStatus}: {
    selected: GameVideoType,
    soundStatus: boolean,
    options: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
}) => {
    const [loading, setLoading] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [videoData, setVideoData] = React.useState<{
        src: { src: string, type: string }[],
        poster?: string
    }>({src: []});
    const timerRef = React.useRef(null);

    const hideFooter = () => {
        document.querySelector('footer').style.removeProperty('opacity');
        timerRef.current = setTimeout(() => {
            document.querySelector('footer').style.opacity = '0';
        }, 4000)
    }

    React.useEffect(() => {
        setLoading(true)
        setVideoData({src: []});
        getData(selected)
        hideFooter()
    }, [selected]);

    React.useEffect(() => {
        return () => {
            clearTimeout(timerRef.current);
            setVideoData({src: []});
            document.querySelector('footer').style.removeProperty('opacity');
        }
    }, [])

    React.useEffect(() => {
        videoRef.current?.load();
    }, [videoData])

    const getData = (data: GameVideoType) => {
        const {type, thumbnail} = data;
        if (data.webm) {
            setVideoData({
                poster: thumbnail as string,
                src: [{src: data.mp4.max, type: "video/mp4",}, {src: data.webm.max, type: "video/webm",}]
            })
            setLoading(false);
        }

        if (type === 'epicHosted') {
            const [videos] = Object.values(JSON.parse(data.recipes)) as {
                outputs: { key: string, url: string, contentType: string }[]
            }[][];
            setVideoData({
                poster: videos[0].outputs.find(({key}) => key === 'thumbnail').url,
                src: videos.map(v => {
                    const {url, contentType} = v.outputs.find(({key}) => key === 'manifest')
                    return {src: url, type: contentType}
                })
            })
            setLoading(false);
        }

        if (type === 'egsV2') {
            setVideoData({poster: data.poster, src: data.src})
            setLoading(false);
        }

        if (type === 'upload') {
            const src = data.path + data.publicId;
            electronConnector.imageProxy(src
                .replace('/video/upload/', '/image/upload/')
                .replace('/Video/', '/Video/posters/')
            ).then(bytes => {
                setVideoData(({src}) => ({
                    poster: URL.createObjectURL(new Blob(bytes)),
                    src
                }))
            })

            electronConnector.imageProxy(src).then(bytes => {
                setVideoData(({poster}) => ({
                    poster,
                    src: [{src: URL.createObjectURL(new Blob(bytes)), type: 'video/mp4'}]
                }))
                setLoading(false);
            })
        }

        if (data.playbackURLs) {
            const getType = (t: string) => {
                if (t === 'M3U8') return 'application/x-mpegURL';
                return 'video/' + t
            }
            setVideoData({
                poster: (thumbnail as { url: string }).url,
                src: data.playbackURLs.map(({url, videoMimeType}) => ({src: url, type: getType(videoMimeType)}))
            })
            setLoading(false);
        }
    }

    if (selected.provider) {
        const providerWrapper: React.CSSProperties = {
            background: `url('${selected._links.thumbnail.href}') top center no-repeat`,
            backgroundSize: 'cover',
            position: 'relative'
        }
        if (selected.provider === "youtube") {
            return <div onClick={hideFooter} style={providerWrapper} role="button" tabIndex={0}>
                <iframe width={window.innerWidth} height={window.innerWidth / (16 / 9)}
                        title={'youtube'}
                        src={`https://www.youtube.com/embed/${selected.videoId}?autoplay=true&loop=1&rel=0&mute=${soundStatus ? 0 : 1}`}
                />
            </div>
        }
        if (selected.provider === 'wistia') {
            return <div onClick={hideFooter} style={providerWrapper} role="button" tabIndex={0}>
                <iframe width={window.innerWidth} height={window.innerWidth / (16 / 9)}
                        title={'wistia'}
                        src={`https://fast.wistia.net/embed/iframe/${selected.videoId}`}
                />
            </div>
        }
    }

    return (
        <div onClick={hideFooter} style={{position: 'relative'}} role="button" tabIndex={0}>
            <Loader loading={loading} opacity={0.6}/>
            <video ref={videoRef}  {...options} poster={videoData.poster} muted={!soundStatus}>
                {videoData.src.map(s => <source key={s.type} {...s} />)}
                <track kind={'captions'} label={'English'} srcLang={'en'} default={true}/>
            </video>
        </div>
    );
};

export default VideoComponent