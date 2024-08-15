import React, {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import useAppControls from "../../hooks/useAppControls";
import useNotification from "../../hooks/useNotification";
import OverlayContent from "./overlay.content";
import {useParams} from "react-router-dom";

const Overlay = () => {
    const [visible, setVisible] = useState(false);
    const params = useParams();
    const notifications = useNotification();
    const {init} = useAppControls({
        map: {
            'home': () => {
                electronConnector.toggleOverlay()
            },
            'a': () => {
                document.activeElement?.click()
            },
            'b': () => {
                if(visible){
                    electronConnector.closeFile(`${window.location.origin}/game/${params.id}`);
                }
            }
        },
        abstract: true,
    });

    const game = JSON.parse(localStorage.getItem('games')).find(({id}) => id.toString() === params.id) || {};

    useEffect(() => {
        notifications({
            status: 'success',
            img: game.img_icon,
            name: 'Started',
            description: game.name,
        })

        init()

        electronConnector.onVisibilityChange(e => {
            setVisible(e)
        })
    }, []);

    if(visible){
        return <OverlayContent/>
    }

    return null
}

export default Overlay;