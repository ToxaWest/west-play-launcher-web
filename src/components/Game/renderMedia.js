import {useEffect, useRef, useState} from "react";
import styles from "./game.module.scss";
import useFooterActions from "../../hooks/useFooterActions";

const RenderMedia = ({
                         game,
                         play = () => {
                         },
                         pause = () => {
                         }
                     }) => {
    const [current, setCurrent] = useState(0);
    const videoRef = useRef(null)
    const {setFooterActions} = useFooterActions();
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
                if (videoRef.current) {
                    videoRef.current.muted = false;
                    videoRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    play()
                }
            },
            lt: () => {
                if (videoRef.current) {
                    pause()
                    videoRef.current.muted = true;
                }
            }
        }
        if (map[detail]) {
            map[detail]()
        }
    }

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        setFooterActions([{
            img: 'left-trigger.svg',
            title: 'Sound OFF',
            onClick: () => {
                if (videoRef.current) {
                    pause()
                    videoRef.current.muted = true;
                }
            }
        }, {
            img: 'right-trigger.svg',
            title: 'Sound ON',
            onClick: () => {
                if (videoRef.current) {
                    play()
                    videoRef.current.muted = false;
                }
            }
        }, {
            img: 'dpad-up.svg',
            title: 'Prev',
            onClick: () => {
                setCurrent((i) => {
                    if (i === 0) {
                        return [...movies, ...screenshots].length - 1
                    }
                    return i - 1
                })
            }
        }, {
            img: 'dpad-down.svg',
            title: 'Next',
            onClick: () => {
                setCurrent((i) => {
                    if (i === (media.length - 1)) {
                        return 0
                    }
                    return i + 1
                })
            }
        }])
        return () => {
            document.removeEventListener('gamepadbutton', listener)
        }
    }, []);

    const renderMedia = (i) => {
        const selected = media[i];
        if (selected?.webm) {
            return <video src={selected.webm.max} controls={false} muted={true} autoPlay={true} loop={true}
                          ref={videoRef}/>;
        }

        if (selected?.path_full) {
            return <img src={selected.path_full} alt={'img'}/>
        }

        if (selected?.playbackURLs) {
            const _cur = selected.playbackURLs[1];
            if(!_cur){
                return null
            }
            return <video src={_cur.url} controls={false} muted={true} autoPlay={true} loop={true}
                          ref={videoRef}/>
        }

        return null;
    }

    if (!media.length) {
        return (<h2 align="center">Media not found</h2>)
    }

    return (
        <div className={styles.media}>
            {renderMedia(current)}
        </div>
    )
}

export default RenderMedia