import {useEffect, useState} from "react";
import styles from "./game.module.scss";
import useFooterActions from "../../hooks/useFooterActions";
import Video from "../Video";
import useAppControls from "../../hooks/useAppControls";

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

    const next = (i) => i === (media.length - 1) ? 0 : i + 1
    const prev = (i) => i === 0 ? [...movies, ...screenshots].length - 1 : i - 1

    useAppControls({
        map: {
            bottom: () => {
                setCurrent(next)
            },
            top: () => {
                setCurrent(prev)
            },
            rt: () => {
                setSoundStatus(true)
                document.querySelector(':root').scrollIntoView({behavior: 'smooth', block: 'end'})
                play()
            },
            lt: () => {
                pause()
                setSoundStatus(false)
            }
        }
    })

    useEffect(() => {
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
                setCurrent(prev)
            }
        }, {
            img: 'dpad-down.svg',
            title: 'Next',
            onClick: () => {
                setCurrent(next)
            }
        }])
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