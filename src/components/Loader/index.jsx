import styles from './Loader.module.scss';

const Loader = ({loading, opacity}) => {
    if(!loading) return null
    return (
        <div className={styles.wrapper} style={opacity ? {opacity: opacity} : {}}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default Loader