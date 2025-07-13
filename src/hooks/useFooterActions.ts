import {use} from "react";
import type {gamePadButtonName} from "@type/gamePad.types";
import type {footerActionsType} from "@type/provider.types";
import {useNavigate} from "react-router-dom";

import {AppContext} from "../helpers/provider";
import i18n from "../helpers/translate";

const useFooterActions = () => {
    const {footerActions, setFooterActions} = use(AppContext);
    const navigate = useNavigate();
    const back = {
        '': '/',
        'game': '/',
        'library': '/',
        'media': '/',
        'movie':'/',
        'settings': '/'
    }

    const backButton = () => {
        if (window.location.pathname === '/menu') {
            navigate(-1);
        } else {
            if (window.__back) navigate(window.__back.url)
            else navigate(back[window.location.pathname.split('/').at(1)])
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
            title: i18n.t('Select')
        },
        b: {
            button: 'b',
            onClick: backButton,
            title: i18n.t('Back')
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