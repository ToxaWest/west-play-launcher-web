import styles from './footer.module.scss';
import useFooterActions from "../../hooks/useFooterActions";
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";
import {useNavigate} from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const {footerActions} = useFooterActions();
    const {setMap} = useAppControls()

    const menuButton = () => {
        if (window.location.pathname === '/menu') {
            navigate(-1);
        } else {
            navigate('/menu')
        }
    }

    const imgMapping = {
        select: 'menu.svg',
        a: 'a-filled-green.svg',
        b: 'b-filled red.svg',
        y: 'y-filled-yellow.svg',
        x: 'x-filled-blue.svg',
        lt: 'left-trigger.svg',
        rt: 'right-trigger.svg',
        top: 'dpad-up.svg',
        bottom: 'dpad-down.svg'
    }

    useEffect(() => {
        setMap(Object.values(footerActions).reduce((acc, current) => {
            acc[current.button] = current.onClick;
            return acc;
        }, {select: menuButton}));
    }, [footerActions]);

    const actions = {
        select: {
            title: 'Menu',
            button: 'select',
            onClick: menuButton
        }, ...footerActions
    }

    const renderFooterActions = ({onClick, title, button}) => (
        <div onClick={onClick} key={button}>
            <img src={'/assets/controller/' + imgMapping[button]} alt={title} width={32} height={32}/>
            {title}
        </div>
    )

    return (
        <footer className={styles.wrapper}>
            {Object.values(actions).filter(a => a.title).map(renderFooterActions)}
        </footer>
    )
}

export default Footer