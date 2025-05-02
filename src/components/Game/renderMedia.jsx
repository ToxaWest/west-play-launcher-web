import {useEffect, useState} from "react";
import styles from "./game.module.scss";
import useFooterActions from "../../hooks/useFooterActions";
import Video from "../Video";
import electronConnector from "../../helpers/electronConnector";

const RenderMedia = ({game}) => {
    const [current, setCurrent] = useState(0);
    const {setFooterActions, removeFooterActions} = useFooterActions();
    const {
        movies = [],
        screenshots = []
    } = game;

    const media = [...movies, ...screenshots];
    const [soundStatus, setSoundStatus] = useState(false);

    const next = (i) => i === (media.length - 1) ? 0 : i + 1
    const prev = (i) => i === 0 ? [...movies, ...screenshots].length - 1 : i - 1

    useEffect(() => {
        setFooterActions({
            lt: {
                title: 'Sound OFF',
                button: 'lt',
                onClick: () => {
                    setSoundStatus(false)
                }
            }, rt: {
                title: 'Sound ON',
                button: 'rt',
                onClick: () => {
                    document.querySelector(':root').scrollIntoView({behavior: 'smooth', block: 'end'})
                    setSoundStatus(true)
                }
            }, top: {
                title: 'Prev',
                button: 'top',
                onClick: () => {
                    setCurrent(prev)
                }
            }, bottom: {
                title: 'Next',
                button: 'bottom',
                onClick: () => {
                    setCurrent(next)
                }
            }
        })
        return () => {
            removeFooterActions(['bottom', 'lt', 'rt', 'top'])
        }
    }, []);


    const renderMedia = (i) => {
        const selected = media[i];
        if (selected?.path_full) {
            return <img src={selected.path_full} onError={e => {
                if (e.target.src !== (selected.path_full)) return;
                electronConnector.imageProxy(e.target.src).then(bytes => {
                    e.target.src = URL.createObjectURL(new Blob(bytes))
                })
            }} alt={'img'}/>
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