import {useLocation, useNavigate} from "react-router-dom";
import styles from './HeaderMenu.module.scss';
import {useEffect} from "react";
import useFooterActions from "../../hooks/useFooterActions";

const HeaderMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {setFooterActions} = useFooterActions()
    const links = {
        '/': 'Home',
        '/library': 'Library',
        '/freeGames': 'Free Games',
        '/lastCracked': 'Last Cracked',
        '/wishList': 'WishList',
    }
    useEffect(() => {
        if (Object.keys(links).includes(location.pathname)) {
            setFooterActions({
                lb: {
                    button: 'lb',
                    onClick: () => toggleViewMode('previous'),
                }, rb: {
                    button: 'rb',
                    onClick: () => toggleViewMode('next'),
                }
            })
        }
    }, [location.pathname])

    const toggleViewMode = (direction) => {
        if (!Object.keys(links).includes(window.location.pathname)) {
            return null
        }
        const index = Object.keys(links).findIndex((url) => url === window.location.pathname);
        if (direction === 'previous') {
            if (index === 0) {
                navigate(Object.keys(links).at(-1))
            } else {
                navigate(Object.keys(links).at(index - 1))
            }
        }

        if (direction === 'next') {
            if (index === Object.keys(links).length - 1) {
                navigate(Object.keys(links).at(0))
            } else {
                navigate(Object.keys(links).at(index + 1))
            }
        }
    }

    if (!Object.keys(links).includes(location.pathname)) {
        return null
    }

    return (
        <ul className={styles.wrapper}>
            {Object.entries(links).map(([link, name]) => (
                <li key={link}
                    className={link === location.pathname ? styles.active : ''}
                    onClick={() => {
                        navigate(link)
                    }}>
                    {name}
                </li>
            ))}
        </ul>
    )
}

export default HeaderMenu