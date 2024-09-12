import {useEffect, useState} from "react";
import styles from "./game.module.scss";
import useFooterActions from "../../hooks/useFooterActions";
import Video from "../Video";

const RenderMedia = ({
                         game,
                         play = () => {
                         },
                         pause = () => {
                         }
                     }) => {
    const [current, setCurrent] = useState(0);
    const {setFooterActions} = useFooterActions();
    const {
        movies = [],
        screenshots = []
    } = game;

    const media = [...movies, ...screenshots];
    const [soundStatus, setSoundStatus] = useState(false);

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
                setSoundStatus(true)
                document.querySelector(':root').scrollIntoView({ behavior: 'smooth', block: 'end' })
                play()
            },
            lt: () => {
                pause()
                setSoundStatus(false)
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
                pause()
                setSoundStatus(true)
            }
        }, {
            img: 'right-trigger.svg',
            title: 'Sound ON',
            onClick: () => {
                play()
                setSoundStatus(false)
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
        if (selected?.path_full) {
            return <img src={selected.path_full} alt={'img'}/>
        }

        return <Video
            selected={selected}
            soundStatus={soundStatus}
            options={{controls: false, muted: true, autoPlay: true, loop: true}}/>;
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