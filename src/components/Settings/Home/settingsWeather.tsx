import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import Input from "../../Input";

import styles from "../settings.module.scss";

const SettingsWeather = () => {
    const initialSettings = getFromStorage('weather');
    const [settings, setSettings] = React.useState(initialSettings);
    const [temp, setTemp] = React.useState([]);
    const [search, setSearch] = React.useState("");


    React.useEffect(() => {
        if (search && search.length > 3) {
            electronConnector.weatherSearch(search).then(setTemp)
        }
    }, [search]);

    return (
        <div>
            <Input label="City"
                   onChange={({value}) => {
                       setTemp([]);
                       setSearch(value as string);
                   }}
                   children={(
                       <>
                           <span>{settings.name} ({settings?.sys?.country})</span>
                           <ul className={styles.search}>
                               {temp.map((w) => (
                                   <li key={w.id} role="button" onClick={() => {
                                       setSearch('')
                                       setTemp([]);
                                       setSettings(w)
                                       setToStorage('weather', w)
                                       window.location.reload()
                                   }}>
                                       <span>{w.name} ({w.sys.country})</span>
                                   </li>)
                               )}
                           </ul>
                       </>

                   )}
            />
        </div>
    )
}

export default SettingsWeather