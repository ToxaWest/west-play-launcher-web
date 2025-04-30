import styles from './Loader.module.scss';

const Loader = ({loading}) => {
    if(!loading) return null
    return (
        <div className={styles.wrapper}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default Loader