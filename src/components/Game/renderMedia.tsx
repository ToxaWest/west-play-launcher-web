import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {Game, GameVideoType} from "@type/game.types";

import electronConnector from "../../helpers/electronConnector";
import Video from "../Video";

import styles from "./game.module.scss";

const RenderMedia = ({game}: { game: Game }) => {
    const [current, setCurrent] = React.useState<number>(0);
    const {setFooterActions, removeFooterActions} = useFooterActions();
    const {
        movies = [],
        screenshots = []
    } = game;

    const media: ({ path_full?: string } | GameVideoType)[] = [...movies, ...screenshots];
    const [soundStatus, setSoundStatus] = React.useState(false);

    const next = (i: number) => i === (media.length - 1) ? 0 : i + 1
    const prev = (i: number) => i === 0 ? [...movies, ...screenshots].length - 1 : i - 1

    React.useEffect(() => {
        setFooterActions({
            bottom: {
                button: 'bottom',
                onClick: () => {
                    setCurrent(next)
                },
                title: 'Next'
            }, lt: {
                button: 'lt',
                onClick: () => {
                    setSoundStatus(false)
                },
                title: 'Sound OFF'
            }, rt: {
                button: 'rt',
                onClick: () => {
                    document.querySelector(':root').scrollIntoView({behavior: 'smooth', block: 'end'})
                    setSoundStatus(true)
                },
                title: 'Sound ON'
            }, top: {
                button: 'top',
                onClick: () => {
                    setCurrent(prev)
                },
                title: 'Prev'
            }
        })
        return () => {
            removeFooterActions(['bottom', 'lt', 'rt', 'top'])
        }
    }, []);


    const renderMedia = (i: number) => {
        const selected = media[i];
        if (Object.hasOwn(selected, 'path_full')) {
            return <img src={(selected as { path_full: string }).path_full} onError={e => {
                const imgTarget = e.target as HTMLImageElement;
                imgTarget.style.display = 'none';
                if (imgTarget.src !== ((selected as { path_full: string }).path_full)) return;

                electronConnector.imageProxy(imgTarget.src).then(bytes => {
                    imgTarget.style.display = 'block';
                    imgTarget.src = URL.createObjectURL(new Blob(bytes))
                })
            }} alt={'img'}/>
        }

        return <Video
            selected={selected as GameVideoType}
            soundStatus={soundStatus}
            options={{autoPlay: true, controls: false, loop: true, muted: true}}
        />;
    }

    if (!media.length) {
        return (<h2 style={{textAlign: "center"}}>Media not found</h2>)
    }

    return (
        <div className={styles.media}>
            {renderMedia(current)}
        </div>
    )
}

export default RenderMedia