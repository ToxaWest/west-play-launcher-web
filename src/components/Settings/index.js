import styles from "./settings.module.scss";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import useFooterActions from "../../hooks/useFooterActions";

const Settings = () => {
    const {setFooterActions, removeFooterActions} = useFooterActions()

    useEffect(() => {
        setFooterActions({
            rb: {
                button: 'rb',
                onClick: () => toggleViewMode('next')
            },
            lb: {
                button: 'lb',
                onClick: () => toggleViewMode('previous')
            }
        })

        return () => {
            removeFooterActions(['rb', 'lb'])
        }
    }, [])

    const navigate = useNavigate();
    const location = useLocation();

    const links = {
        '/settings': 'Home',
        '/settings/config': 'Config',
        '/settings/games': 'Games',
    }
    const toggleViewMode = (direction) => {
        const _links = Object.keys(links);
        const index = _links.findIndex((url) => url === window.location.pathname);
        if (direction === 'previous') {
            if (index === 0) {
                navigate(_links.at(-1))
            } else {
                navigate(_links.at(index - 1))
            }
        }

        if (direction === 'next') {
            if (index === _links.length - 1) {
                navigate(_links.at(0))
            } else {
                navigate(_links.at(index + 1))
            }
        }
    }

    const renderNavigation = () => {
        return (
            <div className={styles.navigation} id="navigation">
                <img src={'/assets/controller/left-bumper.svg'} alt={'prev'} onClick={() => {
                    toggleViewMode('previous')
                }}/>
                {Object.entries(links).map(([key, value]) => (
                    <Link key={key} to={key}
                          className={location.pathname === key ? styles.navActive : ''}>{value}</Link>
                ))}
                <img src={'/assets/controller/right-bumper.svg'} alt={'next'}
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