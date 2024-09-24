import {createPortal} from "react-dom";
import {useEffect} from "react";
import useFooterActions from "../../hooks/useFooterActions";

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
    const {setFooterActions, removeFooterActions} = useFooterActions()

    const close = () => {
        onClose(true)
    }

    useEffect(() => {
        setFooterActions({
            x: {
                button: 'x',
                title: 'Close',
                onClick: close
            }
        })
        return () => {
            removeFooterActions(['x'])
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