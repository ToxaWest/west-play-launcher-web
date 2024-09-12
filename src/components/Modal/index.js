import {createPortal} from "react-dom";
import {useEffect} from "react";
import useFooterActions from "../../hooks/useFooterActions";

const style = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100vw',
    zIndex: 2,
    padding: '5vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    overflowY: 'scroll',
    backgroundColor: 'var(--theme-color)',
    opacity: '.95',
}

const Modal = ({children, onClose}) => {
    const {setFooterActions} = useFooterActions()

    const close = () => {
        onClose(true)
    }

    const listener = (e) => {
        const {detail} = e

        const map = {
            x: close,
        }

        if (map[detail]) {
            map[detail]()
        }
    }

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        setFooterActions([{
            img: 'x-filled-blue.svg',
            title: 'Close',
            onClick: close
        }])
        return () => {
            setFooterActions([])
            window.removeEventListener('gamepadbutton', listener)
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