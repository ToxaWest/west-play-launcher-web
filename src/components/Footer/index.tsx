import React from "react";
import {useNavigate} from "react-router-dom";

import useAppControls from "../../hooks/useAppControls";
import useFooterActions from "../../hooks/useFooterActions";
import type {gamePadButtonName} from "../../types/gamePad.types";
import type {footerActionsType,footerActionType} from "../../types/provider.types";

import styles from './footer.module.scss';

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

    const imgMapping: { [key in gamePadButtonName]?: string } = {
        a: 'a-filled-green.svg',
        b: 'b-filled red.svg',
        bottom: 'dpad-down.svg',
        lb: 'left-bumper.svg',
        lt: 'left-trigger.svg',
        rb: 'right-bumper.svg',
        rt: 'right-trigger.svg',
        select: 'menu.svg',
        top: 'dpad-up.svg',
        x: 'x-filled-blue.svg',
        y: 'y-filled-yellow.svg'
    }

    React.useEffect(() => {
        setMap(Object.values(footerActions).reduce((acc, current) => {
            acc[current.button] = current.onClick;
            return acc;
        }, {select: menuButton}));
    }, [footerActions]);

    const actions: footerActionsType = {
        ...footerActions,
        select: {
            button: 'select',
            onClick: menuButton,
            title: 'Menu'
        }
    }

    const renderFooterActions = ({onClick, title, button}: footerActionType) => (
        <div onClick={onClick} role="button" tabIndex={0} key={button}>
            <img src={'/assets/controller/' + imgMapping[button]} alt={title} width={32} height={32}/>
            {title}
        </div>
    )

    return (
        <footer className={styles.wrapper}>
            {Object.values(actions).filter(a => a.title).reverse().map(renderFooterActions)}
        </footer>
    )
}

export default Footer