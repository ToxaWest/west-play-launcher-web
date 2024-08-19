import styles from './footer.module.scss';

const Footer = ({backButton, menuButton}) => {
    return (
        <footer className={styles.wrapper}>
            <div onClick={menuButton}>
                <img src={'/assets/controller/menu.svg'} alt="menu"
                     width={32}
                />
                Menu
            </div>
            <div
                onClick={() => {
                    document.activeElement?.click()
                }}
            >
                <img src={'/assets/controller/a-filled-green.svg'} alt="select"
                     width={32}/>
                Select
            </div>
            <div
                onClick={backButton}
            >
                <img src={'/assets/controller/b-filled red.svg'} alt="back"
                     width={32}
                />
                Back
            </div>
        </footer>
    )
}

export default Footer