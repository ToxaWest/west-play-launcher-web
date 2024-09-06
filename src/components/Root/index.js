import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import styles from './root.module.scss';
import Footer from "../Footer";
import Clock from "../Clock";
import useAppControls from "../../hooks/useAppControls";

const Root = () => {
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

    const menuButton = () => {
        if (window.location.pathname === '/menu') {
            navigate(-1);
        } else {
            navigate('/menu')
        }
    }

    const {init} = useAppControls({
        map: {
            select: menuButton,
            b: backButton,
            a: () => {
                if (document.activeElement) {
                    document.activeElement.click()
                }
            }
        }
    })

    useEffect(() => {
        const body = document.querySelector('html');
        init('#contentWrapper [tabindex="1"], #contentWrapper button:not(:disabled)')
        document.addEventListener('mousemove', () => {
            body.style.removeProperty('cursor');
            body.style.removeProperty('pointer-events');
        })
    }, [])

    return (
        <div className={styles.wrapper}>
            <Clock/>
            <div className={styles.content} id="contentWrapper">
                <Outlet/>
            </div>
            <Footer backButton={backButton} menuButton={menuButton}/>
        </div>
    )
}
export default Root;