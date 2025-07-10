import React from "react";

import type {notificationsType} from "../../types/provider.types";

import styles from "./notifications.module.scss";

interface StyleInterface extends React.CSSProperties {
    '--bg-color': string
}

const Notifications = ({notifications}: { notifications: notificationsType }) => {
    const colors = {
        'error': 'rgba(240,62,31,0.9)',
        'saving': 'rgba(255,199,4,0.9)',
        'success': 'rgba(127,187,0,0.9)',
        'warning': 'rgba(246,140,0,0.9)'
    }

    if (!notifications) {
        return null
    }

    const {img, description, name, status} = notifications;

    const style: StyleInterface = {
        '--bg-color': colors[status]
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.content} style={style}>
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