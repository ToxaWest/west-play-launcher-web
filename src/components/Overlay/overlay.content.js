import Clock from "../Clock";
import electronConnector from "../../helpers/electronConnector";
import React, {useEffect} from "react";
import styles from "./overlay.module.scss";
import useAppControls from "../../hooks/useAppControls";
import {useParams} from "react-router-dom";

const OverlayContent = () => {
    const params = useParams();

    const {init} = useAppControls({
        map: {
            top: (i) => i - 1,
            bottom: (i) => i + 1
        }
    });

    const game = JSON.parse(localStorage.getItem('games')).find(({id}) => id.toString() === params.id) || {};

    useEffect(() => {
        init({
            selector: '#overlay button'
        })
    }, []);

    return (
        <div className={styles.wrapper} id={'overlay'}>
            <Clock/>
            <h1>{game.name}</h1>
            <button
                autoFocus={true}
                onClick={() => {
                    electronConnector.closeFile(`${window.location.origin}/game/${params.id}`);
                }}
            >Close {game.name}</button>
            <button onClick={() => {
                electronConnector.toggleOverlay()
            }}>Resume
            </button>
        </div>
    )
}

export default OverlayContent