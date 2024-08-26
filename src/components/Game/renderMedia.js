import {useEffect, useRef, useState} from "react";
import styles from "./game.module.scss";

const RenderMedia = ({game}) => {
    const [current, setCurrent] = useState(0);
    const videoRef = useRef(null)

    const {
        movies = [],
        screenshots = []
    } = game;

    const media = [...movies, ...screenshots];

    const listener = ({detail}) => {
        const map = {
            bottom: () => {
                setCurrent((i) => {
                    if (i === (media.length - 1)) {
                        return 0
                    }
                    return i + 1
                })
            },
            top: () => {
                setCurrent((i) => {
                    if (i === 0) {
                        return [...movies, ...screenshots].length - 1
                    }
                    return i - 1
                })
            },
            rt: () => {
                if(videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                }
            }
        }
        if (map[detail]) {
            map[detail]()
        }
    }

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        return () => {
            document.removeEventListener('gamepadbutton', listener)
        }
    }, []);

    const renderMedia = (i) => {
        const selected = media[i];
        if (selected?.webm) {
            return <video src={selected.webm.max} controls={false} muted={true} autoPlay={true} loop={true} ref={videoRef}/>;
        }

        if (selected?.path_full) {
            return <img src={selected.path_full} alt={'img'}/>
        }
        return null;
    }

    return (
        <div className={styles.media}>
            {renderMedia(current)}
        </div>
    )
}

export default RenderMedia