import {Link, useLocation} from "react-router-dom";
import styles from './menu.module.scss';
import {useEffect, useRef, useState} from "react";

const Menu = ({active, setMenu, pressedKeys}) => {
    const ref = useRef(null);
    const selected = useRef(0);
    const {pathname} = useLocation();
    const listener = () => {
        if (!active) {
            return;
        }
        if (pressedKeys.includes('bottom')) {
            if (selected.current + 1 >= ref.current.length) {
                return
            } else {
                selected.current++;
                ref.current[selected.current].focus()
            }
        }
        if (pressedKeys.includes('top')) {
            if (selected.current === 0) {
                return;
            } else {
                selected.current--;
                ref.current[selected.current].focus()
            }
        }

        if (pressedKeys.includes('a')) {
            setMenu(false)
        }
    }

    const setInitialFocus = () => {
        ref.current.forEach((item, i) => {
            if(item.href.replace(item.origin, '') === pathname){
                ref.current[i].focus();
            }
        })
        if(!document.activeElement) {
            ref.current[0].focus();
        }
    }

    useEffect(() => {
        if (pressedKeys.length && active) {
            if(!document.activeElement) {
                ref.current[0].focus();
            }
            listener()
        }
    }, [pressedKeys]);



    useEffect(() => {
        if (active) {
            ref.current = document.querySelectorAll('#main-menu a')
            setInitialFocus()
        }
    }, [active]);

    return (
        <div className={styles.wrapper} id="main-menu">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
                <li>
                    <Link to="/" onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        window.electronAPI.openOverlay()
                    }}>Overlay</Link>
                </li>
            </ul>
        </div>

    )
}

export default Menu