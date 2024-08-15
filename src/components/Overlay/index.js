import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import electronConnector from "../../helpers/electronConnector";
import useAppControls from "../../hooks/useAppControls";
import useNotification from "../../hooks/useNotification";
import Clock from "../Clock";
import styles from './overlay.module.scss';

const Overlay = () => {
    const params = useParams();
    const [visible, setVisible] = useState(false);
    const notifications = useNotification();
    const {init: initHome} = useAppControls({
        map: {
            'home': () => setVisible((a) => !a),
        },
        abstract: true,
    });

    const {init} = useAppControls({
        map: {
            top: (i) => i - 1,
            bottom: (i) => i + 1
        },
        abstract: true,
    });


    const game = JSON.parse(localStorage.getItem('games')).find(({id}) => id === params.id);

    useEffect(() => {
        notifications({
            status: 'success',
            img: game.img_icon,
            name: 'Started',
            description: game.name,
        })
        initHome()
    }, []);

    useEffect(() => {
        if(visible){
            init({
                selector: '#overlay button'
            })
        }
    }, [visible]);

    return (
        <div className={styles.wrapper} style={{display: !visible ? 'none' : 'inherit'}}>
            <Clock/>
            <h1>{game.name}</h1>
            <button onClick={() => {
                if (visible) {
                    electronConnector.closeFile(`${window.location.origin}/game/${params.id}`);
                }
            }}
                onFocus={() => {
                    console.log('focus')
                }}
            >Close {game.name}</button>
            <button onClick={() => {
                setVisible(false)
            }}>Resume</button>
        </div>
    )
}

export default Overlay;