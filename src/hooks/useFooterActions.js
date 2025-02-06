import {useContext, useEffect} from "react";
import {AppContext} from "../helpers/provider";
import {useLocation, useNavigate} from "react-router-dom";

const useFooterActions = () => {
    const {footerActions, setFooterActions} = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const back = {
        '': '/',
        'game': '/',
        'settings': '/'
    }

    const backButton = () => {
        if (window.location.pathname === '/menu') {
            navigate(-1);
        } else {
            if (window.__back) {
                navigate(window.__back.url)
            } else {
                navigate(back[location.pathname.split('/').at(1)])
            }
        }
    }
    const defaultActions = {
        b: {
            button: 'b',
            title: 'Back',
            onClick: backButton
        },
        a: {
            button: 'a',
            title: 'Select',
            onClick: () => {
                document.activeElement?.click()
            }
        },
    }

    useEffect(() => {
        setFooterActions(defaultActions);
    }, []);

    return {
        footerActions,
        setFooterActions: (actions) => {
            setFooterActions(r => ({...defaultActions, ...r, ...actions}));
        },
        removeFooterActions: (actions) => {
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