import React from "react";
import useAppControls from "@hook/useAppControls";
import {Outlet} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import {modalIsActive} from "../../helpers/modalIsActive";
import Clock from "../Clock";
import Footer from "../Footer";

const Background = ({
    onLoad,
    videoBg,
    bgImage,
    className
}: {
    onLoad: (e: React.SyntheticEvent<HTMLVideoElement | HTMLImageElement>) => void,
    videoBg?: string,
    bgImage?: string | null,
    className?: string
}) => {
    if (!videoBg && !bgImage) return null;

    if (videoBg) {
        return (
            <video
                className={className}
                autoPlay
                loop
                muted
                onLoadedData={onLoad}
                src={videoBg}
            />
        );
    }

    return (
        <img
            className={className}
            alt="background"
            onLoad={onLoad}
            src={bgImage || ''}
        />
    );
}

const Root = () => {
    const {init} = useAppControls()
    const {videoBg} = getFromStorage('config').settings;
    const [bgImage, setBgImage] = React.useState<string | null>(null);
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        init('#contentWrapper')
        modalIsActive((active) => {
            init(active ? '#modal' : '#contentWrapper')
        })

        const handleMouseMove = () => {
            document.documentElement.style.cursor = '';
            document.documentElement.style.pointerEvents = '';
        };

        document.addEventListener('mousemove', handleMouseMove)
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

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        }
    }, [])

    const onLoad = (e: React.SyntheticEvent<HTMLVideoElement | HTMLImageElement>) => {
        (e.target as HTMLElement).style.aspectRatio = `${window.innerWidth / window.innerHeight}`;
        setLoaded(true);
    }

    return (
        <div className="relative bg-[var(--accent-color)] overflow-hidden">
            <div className="absolute inset-0 z-[2] vignette-overlay pointer-events-none" />
            <Background 
                className={`object-cover w-full h-full fixed aspect-video top-0 left-0 z-[1] transition-transform duration-200 ease-out ${loaded ? 'scale-100' : 'scale-0'}`} 
                videoBg={videoBg} 
                bgImage={bgImage} 
                onLoad={onLoad}
            />
            <div className="flex flex-col pb-[50px] min-h-screen z-[3] relative">
                <Clock/>
                <div className="w-full relative" id="contentWrapper">
                    <Outlet/>
                </div>
                <Footer/>
            </div>
        </div>
    )
}
export default Root;