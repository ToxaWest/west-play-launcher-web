import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";

import i18n from "../../helpers/translate";

import styles from "./settings.module.scss";

const Settings = () => {
    const {setFooterActions, removeFooterActions} = useFooterActions()

    React.useEffect(() => {
        setFooterActions({
            lb: {
                button: 'lb',
                onClick: () => toggleViewMode('previous')
            },
            rb: {
                button: 'rb',
                onClick: () => toggleViewMode('next')
            }
        })

        return () => {
            removeFooterActions(['rb', 'lb'])
        }
    }, [])

    const navigate = useNavigate();
    const location = useLocation();

    const links = {
        '/settings': i18n.t('Home'),
        '/settings/games': i18n.t('Games'),
        '/settings/gbe': 'GBE',
        '/settings/import': i18n.t('Import'),
        '/settings/media': i18n.t('Media'),
    }
    const toggleViewMode = (direction: 'previous' | 'next') => {
        const _links = Object.keys(links);
        const index = _links.findIndex((url) => url === window.location.pathname);
        if (direction === 'previous') {
            if (index === 0) navigate(_links.at(-1))
            else navigate(_links.at(index - 1))
        }

        if (direction === 'next') {
            if (index === _links.length - 1) navigate(_links.at(0))
            else navigate(_links.at(index + 1))
        }
    }

    const renderNavigation = () => {
        return (
            <div className={styles.navigation} id="navigation">
                <img src={'/assets/controller/left-bumper.svg'} alt={'prev'} tabIndex={0} role="button" onClick={() => {
                    toggleViewMode('previous')
                }}/>
                {Object.entries(links).map(([key, value]) => (
                    <Link key={key} to={key}
                          className={location.pathname === key ? styles.navActive : ''}>{value}</Link>
                ))}
                <img src={'/assets/controller/right-bumper.svg'} alt={'next'}
                     tabIndex={0} role="button"
                     onClick={() => {
                         toggleViewMode('next')
                     }}/>
            </div>
        )
    }

    return (
        <>
            {renderNavigation()}
            <div className={styles.wrapper}>
                <Outlet/>
            </div>
        </>

    )
}
export default Settings;