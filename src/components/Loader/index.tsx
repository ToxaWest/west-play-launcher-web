import React, {CSSProperties} from "react";

import styles from './Loader.module.scss';

const Loader = ({loading, style}: { loading: boolean, style?: CSSProperties }) => {
    if (!loading) return null

    return (
        <div className={styles.wrapper} style={style}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default Loader