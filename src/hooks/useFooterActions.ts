import {useContext} from "react";
import {AppContext} from "../helpers/provider";
import {useLocation, useNavigate} from "react-router-dom";
import type {gamePadButtonName} from "../types/gamePad.types";

declare global {
    interface Window {
        __back?: {
            url: string
            id: string | number
        };
    }

    interface DocumentEventMap {
        gamePadClick: CustomEvent<{
            button: gamePadButtonName;
            id: number;
        }>;
    }
}

type footerActionsType = {
    [key in gamePadButtonName]?: {
        button: gamePadButtonName;
        title?: string;
        onClick: () => void;
    };
};

const useFooterActions = () => {
    const {footerActions, setFooterActions}: {
        footerActions: footerActionsType,
        setFooterActions: (actions: (r: footerActionsType) => footerActionsType) => void,
    } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const back = {
        '': '/',
        'game': '/',
        'library': '/',
        'settings': '/',
        'media': '/'
    }

    const backButton = () => {
        if (window.location.pathname === '/menu') {
            navigate(-1);
        } else {
            if (window.__back) navigate(window.__back.url)
            else navigate(back[location.pathname.split('/').at(1)])
        }
    }
    const defaultActions: footerActionsType = {
        b: {
            button: 'b',
            title: 'Back',
            onClick: backButton
        },
        a: {
            button: 'a',
            title: 'Select',
            onClick: () => {
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement) {
                    activeElement.click();
                }
            }
        },
    }

    return {
        footerActions,
        setFooterActions: (actions: footerActionsType) => {
            setFooterActions(r => ({...defaultActions, ...r, ...actions}));
        },
        removeFooterActions: (actions: gamePadButtonName[]) => {
            setFooterActions(a => {
                actions.forEach(action => {
                    delete a[action]
                })
                return {...defaultActions, ...a}
            });
        }
    }
}

export default useFooterActions;