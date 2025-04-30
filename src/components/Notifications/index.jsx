import styles from './notifications.module.scss';

const Notifications = (props) => {
    const {notifications} = props;
    const colors = {
        'success': 'rgba(127,187,0,0.9)',
        'error': 'rgba(240,62,31,0.9)',
        'warning': 'rgba(246,140,0,0.9)',
        'saving': 'rgba(255,199,4,0.9)'
    }

    if (!notifications) {
        return null
    }

    const {img, description, name, status} = notifications;

    return (
        <div className={styles.wrapper}>
            <div className={styles.content} style={{'--bg-color': colors[status]}}>
                <div className={styles.image}>
                    <img src={'/assets/controller/Xbox_Logo.svg'} alt={name}/>
                    <img src={img} alt={name}/>
                </div>
                <div className={styles.contentWrapper}>
                    <div className={styles.heading}>
                        {name}
                    </div>
                    {description && <div className={styles.description}>
                        {description}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Notifications;