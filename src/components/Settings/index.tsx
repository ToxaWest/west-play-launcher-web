import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";

import i18n from "../../helpers/translate";

const Settings = () => {
    const {setFooterActions, removeFooterActions} = useFooterActions()
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

    const renderNavigation = () => {
        return (
            <div className="max-w-[90vw] mx-auto my-gap flex gap-gap-half items-center justify-center" id="navigation">
                <img src={'/assets/controller/left-bumper.svg'} alt={'prev'} tabIndex={0} role="button" className="m-gap cursor-pointer" onClick={() => {
                    toggleViewMode('previous')
                }}/>
                {Object.entries(links).map(([key, value]) => (
                    <Link key={key} to={key}
                          className={`p-theme border-b border-transparent focus:outline-none ${location.pathname === key ? 'border-b-text' : ''}`}>{value}</Link>
                ))}
                <img src={'/assets/controller/right-bumper.svg'} alt={'next'}
                     className="m-gap cursor-pointer"
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
            <div className="max-w-[90vw] mx-auto my-gap flex flex-col gap-gap max-h-full [&_ul]:p-0 [&_ul]:list-none [&_ul]:gap-gap-half [&_ul]:my-gap-half [&_ul]:mx-0">
                <Outlet/>
            </div>
        </>
    )
}
export default Settings;