import styles from './footer.module.scss';
import useFooterActions from "../../hooks/useFooterActions";

const Footer = ({backButton, menuButton}) => {
    const {footerActions} = useFooterActions();

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


    const renderFooterActions = ({onClick, title, img}) => (
        <div onClick={onClick} key={title}>
            <img src={'/assets/controller/' + img} alt={title} width={32} height={32}/>
            {title}
        </div>
    )

    return (
        <footer className={styles.wrapper}>
            {actions.map(renderFooterActions)}
        </footer>
    )
}

export default Footer