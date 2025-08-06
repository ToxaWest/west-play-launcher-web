import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {createPortal} from "react-dom";

import i18n from "../../helpers/translate";

const defaultStyle: React.CSSProperties = {
    alignItems: 'center',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    maxHeight: 'calc(100% - 50px)',
    position: 'fixed',
    right: 0,
    top: 0,
    zIndex: 5
}

const Modal = ({children, onClose, style = {}}: {
    children: React.ReactNode,
    onClose: (close: boolean) => void,
    style?: React.CSSProperties,
}) => {
    const {setFooterActions, removeFooterActions} = useFooterActions()

    React.useEffect(() => {
        setFooterActions({
            x: {
                button: 'x',
                onClick: () => {
                    onClose(true)
                },
                title: i18n.t('Close')
            }
        })
        return () => {
            removeFooterActions(['x'])
        }
    }, []);

    return createPortal(
        React.createElement('div', {
                style: {
                    ...defaultStyle,
                    ...style
                },
            },
            children
        ),
        document.querySelector('#modal')
    )
}

export default Modal