import {createPortal} from "react-dom";
import {useEffect} from "react";
import useFooterActions from "../../hooks/useFooterActions";
import useAppControls from "../../hooks/useAppControls";

const style = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const Modal = ({children, onClose}) => {
    const {setFooterActions} = useFooterActions()

    const close = () => {
        onClose(true)
    }
    useAppControls({map: {x: close}})

    useEffect(() => {
        setFooterActions([{
            img: 'x-filled-blue.svg',
            title: 'Close',
            onClick: close
        }])
        return () => {
            setFooterActions([])
        }
    }, []);

    return createPortal(
        <div style={style}>
            {children}
        </div>,
        document.querySelector('#modal')
    )
}

export default Modal