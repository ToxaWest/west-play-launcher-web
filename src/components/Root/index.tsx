import React from "react";
import useAppControls from "@hook/useAppControls";
import {Outlet} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import {modalIsActive} from "../../helpers/modalIsActive";
import Clock from "../Clock";
import Footer from "../Footer";

import styles from './root.module.scss';

const Background = (
    {onLoad, videoBg, bgImage, ...props}: React.HTMLProps<any> & { videoBg: string, bgImage: string }
): React.ReactHTMLElement<any> => {
    if(!videoBg && !bgImage) return null;

    return React.createElement(
        (videoBg ? 'video' : 'img'),
        {
            ...props,
            ...(videoBg ? {
                autoPlay: true,
                loop: true,
                muted: true,
                onLoadedData: onLoad,
                src: videoBg,
            } : {
                alt: 'background',
                onLoad,
                src: bgImage
            })
        }
    )
}

const Root = () => {
    const {init} = useAppControls()
    const {videoBg} = getFromStorage('config').settings;
    const [bgImage, setBgImage] = React.useState<string | null>(null);

    React.useEffect(() => {
        init('#contentWrapper')
        modalIsActive((active) => {
            init(active ? '#modal' : '#contentWrapper')
        })

        document.addEventListener('mousemove', () => {
            document.documentElement.style.cursor = '';
            document.documentElement.style.pointerEvents = '';
        })
        electronConnector.getPlayTime().then(d => {
            const playTime = getFromStorage('playTime');
            const lastPlayed = getFromStorage('lastPlayed');
            Object.entries(d).forEach(([key, value]) => {
                playTime[key] = value.playTime;
                lastPlayed[key] = value.lastPlayed;
            })
            setToStorage('playTime', playTime);
            setToStorage('lastPlayed', lastPlayed);

        })
        electronConnector.getWindowsBG().then(setBgImage)
    }, [])

    const onLoad = (e: React.SyntheticEvent<HTMLVideoElement | HTMLImageElement>) => {
        (e.target as HTMLElement).style.aspectRatio = `${window.innerWidth / window.innerHeight}`
    }

    return (
        <div className={styles.videoBg}>
            <Background className={styles.video} videoBg={videoBg} bgImage={bgImage} onLoad={onLoad}/>
            <div className={styles.wrapper}>
                <Clock/>
                <div className={styles.content} id="contentWrapper">
                    <Outlet/>
                </div>
                <Footer/>
            </div>
        </div>
    )
}
export default Root;