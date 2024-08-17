import styles from './footer.module.scss';
import {useContext} from "react";
import {AppContext} from "../../helpers/provider";

const Footer = ({backButton}) => {
    const {setMenu} = useContext(AppContext);
    return (
        <footer className={styles.wrapper}>
            <div onClick={() => setMenu(a => !a)}>
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