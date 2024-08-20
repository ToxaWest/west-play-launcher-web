import styles from "../settings.module.scss";
import electronConnector from "../../../helpers/electronConnector";
import {useEffect} from "react";
import useAppControls from "../../../hooks/useAppControls";

const SettingsHome = () => {

    const {init, setActiveIndex} = useAppControls({
        map: {
            top: (i) => i - 1,
            bottom: (i) => i + 1,
        }
    })

    useEffect(() => {
        init('#settingsHome button');
        setActiveIndex(0)
    }, []);

    return (
        <div className={styles.block} id="settingsHome">
            <h1>Settings</h1>
            <div className={styles.settingsHome}>
                <h2>Change monitor</h2>
                <button onClick={() => {
                    electronConnector.changeDisplayMode(1)
                }}>Internal Monitor
                </button>
                <button onClick={() => {
                    electronConnector.changeDisplayMode(4)
                }}>External Monitor
                </button>
            </div>
        </div>
    )
}

export default SettingsHome;