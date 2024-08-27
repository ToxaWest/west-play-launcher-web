import styles from './footer.module.scss';
import useFooterActions from "../../hooks/useFooterActions";
import {useEffect, useRef, useState} from "react";

const Footer = ({backButton, menuButton}) => {
    const {footerActions} = useFooterActions();
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    const actions = [{
        img: 'menu.svg',
        title: 'Menu',
        onClick: menuButton
    }, ...footerActions, {
        img: 'a-filled-green.svg',
        title: 'Select',
        onClick: () => {
            document.activeElement?.click()
        }
    }, {
        img: 'b-filled red.svg',
        title: 'Back',
        onClick: backButton
    }]

    useEffect(() => {
        document.addEventListener('gamepadbutton', () => {
            ref.current.style.opacity = 1
            setVisible(true)
        })
    }, [])

    useEffect(() => {
        if(visible){
            setTimeout(() => {
                ref.current.style.opacity = .3
                setVisible(false)
            }, 5000)
        }
    }, [visible])


    const renderFooterActions = ({onClick, title, img}) => (
        <div onClick={onClick} key={title}>
            <img src={'/assets/controller/' + img} alt={title} width={32} height={32}/>
            {title}
        </div>
    )

    return (
        <footer className={styles.wrapper} ref={ref}>
            {actions.map(renderFooterActions)}
        </footer>
    )
}

export default Footer