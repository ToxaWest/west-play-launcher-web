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
            console.log('reinit: ',e )
            console.log(document.activeElement)
            setVisible(e)
        })
    }, []);


    return <OverlayContent visible={visible}/>
}

export default Overlay;