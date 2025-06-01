import {useEffect, useRef} from "react";
import electronConnector from "../../helpers/electronConnector";


const hideFooter = () => {
    document.querySelector('footer').style.opacity = '1';
    setTimeout(() => {
        document.querySelector('footer').style.opacity = '0';
    }, 2500)
}

const VideoComponent = ({selected, options, soundStatus}) => {
    const videoRef = useRef();
    useEffect(() => {
        videoRef.current?.load();
        hideFooter();
        return () => {
            document.querySelector('footer').style.opacity = '1';
            setTimeout(() => {
                document.querySelector('footer').style.opacity = '1';
            }, 2500)
        }
    }, [selected]);
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
                src: [{
                    src: data.path + data.publicId, type: 'video/mp4', onError: (e) => {
                        if (e.target.src !== (data.path + data.publicId)) return;
                        electronConnector.imageProxy(e.target.src).then(bytes => {
                            e.target.src = URL.createObjectURL(new Blob(bytes))
                            videoRef.current?.load();
                        })
                    }
                }],
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


    const {src, poster} = getData(selected);

    return (
        <div onClick={hideFooter}>
            <video ref={videoRef} {...options} poster={poster} muted={!soundStatus}>
                {src.map(s => <source {...s} key={s.type}/>)}
            </video>
        </div>
    );
};

export default VideoComponent