import React from "react";
import type {ReactElement} from "react";
import {Outlet} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../helpers/getFromStorage";
import {modalIsActive} from "../../helpers/modalIsActive";
import useAppControls from "../../hooks/useAppControls";
import Clock from "../Clock";
import Footer from "../Footer";

import styles from './root.module.scss';

const Root = () => {
    const {init} = useAppControls()
    const {videoBg} = getFromStorage('config').settings;

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
    }, [])

    const renderWrapper = (children: ReactElement) => {
        if (videoBg) {
            return (
                <div className={styles.videoBg}>
                    <video src={videoBg} autoPlay={true} muted={true} loop={true} className={styles.video}/>
                    {children}
                </div>
            )
        }

        return children
    }

    return renderWrapper(
        <div className={styles.wrapper}>
            <Clock/>
            <div className={styles.content} id="contentWrapper">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}
export default Root;