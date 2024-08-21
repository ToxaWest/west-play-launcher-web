import styles from "./settings.module.scss";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import useAppControls from "../../hooks/useAppControls";
import {useEffect} from "react";

const Settings = () => {

    const {init, currentIndex, setActiveIndex} = useAppControls({
        map: {
            lb: (i) => i - 1,
            rb: (i) => i + 1,
        }
    })

    const navigate = useNavigate();
    const location = useLocation();

    const links = {
        '/settings': 'Home',
        '/settings/config': 'Config',
        '/settings/games': 'Games',
    }

    useEffect(() => {
        init('#navigation a');
    }, []);

    useEffect(() => {
        navigate(Object.keys(links)[currentIndex])
    }, [currentIndex])

    const renderNavigation = () => {
        return (
            <div className={styles.navigation} id="navigation">
                <img src={'/assets/controller/left-bumper.svg'} alt={'prev'} onClick={() => {
                    setActiveIndex(currentIndex -1);
                }}/>
                {Object.entries(links).map(([key, value]) => (
                    <Link key={key} to={key} className={location.pathname === key ? styles.navActive : ''}>{value}</Link>
                ))}
                <img src={'/assets/controller/right-bumper.svg'} alt={'next'}
                     onClick={() => {
                         setActiveIndex(currentIndex +1);
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