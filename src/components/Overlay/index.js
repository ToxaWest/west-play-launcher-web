import Menu from "../Menu";
import {useEffect, useState} from "react";
import useGamepadButtons from "../../hooks/useGamepadButtons";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import electronConnector from "../../helpers/electronConnector";
import useAppControls from "../../hooks/useAppControls";

const Overlay = () => {
    const params = useParams();
    const [visible, setVisible] = useState(false);

    const {init} = useAppControls({
        map: {
            'home': () => setVisible((a) => !a),
            'b': () => {
                if(visible){
                    electronConnector.closeFile(`${window.location.origin}/game/${params.id}`);
                }
            }
        },
        abstract: true,
    });

    useEffect(() => {
        init()
        electronConnector.onVisibilityChange(e => {
            setVisible(e)
        })
    }, []);

    if(!visible){
        return null
    }

    return <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: "fixed",
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
    }}>
        <h1>Overlay</h1>
    </div>
}

export default Overlay;