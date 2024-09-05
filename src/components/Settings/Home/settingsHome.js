import styles from "../settings.module.scss";
import electronConnector from "../../../helpers/electronConnector";
import {useEffect} from "react";
import useAppControls from "../../../hooks/useAppControls";

const SettingsHome = () => {
    const {init} = useAppControls()

    useEffect(() => {
        init('#settingsHome button');
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
            <div className={styles.settingsHome}>
                <h2>Change theme</h2>
                <button onClick={() => {
                    electronConnector.changeTheme('light')
                }}>Light
                </button>
                <button onClick={() => {
                    electronConnector.changeTheme('dark')
                }}>Dark
                </button>
            </div>
        </div>
    )
}

export default SettingsHome;