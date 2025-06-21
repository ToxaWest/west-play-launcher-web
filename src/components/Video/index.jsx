import {useEffect, useRef, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import Loader from "../Loader";

const VideoComponent = ({selected, options, soundStatus}) => {
    const [loading, setLoading] = useState(false);
    const videoRef = useRef();
    const [videoData, setVideoData] = useState({src: []});
    const timerRef = useRef();

    const hideFooter = () => {
        document.querySelector('footer').style.opacity = '1';
        timerRef.current = setTimeout(() => {
            document.querySelector('footer').style.opacity = '0';
        }, 4000)
    }

    useEffect(() => {
        setLoading(true)
        setVideoData({src: []});
        getData(selected)
        hideFooter()
    }, [selected]);

    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            setVideoData({src: []});
            document.querySelector('footer').style.opacity = '1';
        }
    }, [])

    useEffect(() => {
        videoRef.current?.load();
    }, [videoData])

    const getData = (data) => {
        const {type, thumbnail} = data;
        if (data.webm) {
            setVideoData({
                poster: thumbnail,
                src: [{src: data.mp4.max, type: "video/mp4",}, {src: data.webm.max, type: "video/webm",}]
            })
            setLoading(false);
        }

        if (type === 'epicHosted') {
            const [videos] = Object.values(JSON.parse(data.recipes));
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
                    src,
                    poster: URL.createObjectURL(new Blob(bytes))
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
            const getType = (t) => {
                if (t === 'M3U8') return 'application/x-mpegURL';
                return 'video/' + t
            }
            setVideoData({
                poster: thumbnail.url,
                src: data.playbackURLs.map(({url, videoMimeType}) => ({src: url, type: getType(videoMimeType)}))
            })
            setLoading(false);
        }
    }

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
        <div onClick={hideFooter} style={{position: 'relative'}}>
            <Loader loading={loading} opacity={0.6}/>
            <video ref={videoRef}  {...options} poster={videoData.poster} muted={!soundStatus}>
                {videoData.src.map(s => <source {...s} key={s.type}/>)}
            </video>
        </div>
    );
};

export default VideoComponent