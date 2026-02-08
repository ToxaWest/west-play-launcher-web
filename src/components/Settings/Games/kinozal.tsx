import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import { setToStorage } from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";

const KinozalSettings = () => {
    const handleLogin = async () => {
        const cookies = await electronConnector.kinozalOpenLoginWindow();
        if (cookies && cookies.length > 0) {
            setToStorage('kinozal_cookies', cookies);
            alert(i18n.t('Login successful! Cookies saved.'));
        } else {
            alert(i18n.t('Login window closed or no cookies found.'));
        }
    };

    return (
        <div>
            <h3>{i18n.t('Kinozal.tv Settings')}</h3>
            <p>{i18n.t('Click the button below to open the login window. After you log in, close the window to save your session.')}</p>
            <button onClick={handleLogin}>{i18n.t('Open Login Window')}</button>
        </div>
    );
};

export default KinozalSettings;