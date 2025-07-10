import {use} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {AppContext} from "../helpers/provider";
import type {gamePadButtonName} from "../types/gamePad.types";
import type {footerActionsType} from "../types/provider.types";

const useFooterActions = () => {
    const {footerActions, setFooterActions} = use(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const back = {
        '': '/',
        'game': '/',
        'library': '/',
        'media': '/',
        'settings': '/'
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
        a: {
            button: 'a',
            onClick: () => {
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement) {
                    activeElement.click();
                }
            },
            title: 'Select'
        },
        b: {
            button: 'b',
            onClick: backButton,
            title: 'Back'
        },
    }

    return {
        footerActions,
        removeFooterActions: (actions: gamePadButtonName[]) => {
            setFooterActions(a => {
                actions.forEach(action => {
                    delete a[action]
                })
                return {...defaultActions, ...a}
            });
        },
        setFooterActions: (actions: footerActionsType) => {
            setFooterActions(r => ({...defaultActions, ...r, ...actions}));
        }
    }
}

export default useFooterActions;