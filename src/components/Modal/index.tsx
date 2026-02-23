import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {createPortal} from "react-dom";

import i18n from "../../helpers/translate";

const Modal = ({children, onClose, className = ""}: {
    children: React.ReactNode,
    onClose: (close: boolean) => void,
    className?: string,
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
        <div className={`fixed inset-0 flex items-center justify-center max-h-[calc(100%-50px)] z-[5] ${className}`}>
            {children}
        </div>,
        document.querySelector('#modal')
    )
}

export default Modal