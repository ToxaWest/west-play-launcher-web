import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import {useEffect, useState} from "react";
import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";

const SettingsWeather = () => {
    const [settings, setSettings] = useState(getFromStorage('weather'));
    const [temp, setTemp] = useState([]);
    const [search, setSearch] = useState("");


    useEffect(() => {
        if (search && search.length > 3) {
            electronConnector.weatherSearch(search).then(setTemp)
        }
    }, [search]);

    return (
        <div>
            <Input label="City"
                   onChange={({value}) => {
                       setTemp([]);
                       setSearch(value);
                   }}
                   children={(
                       <>
                           <span>{settings.name} ({settings?.sys?.country})</span>
                           <ul className={styles.search}>
                               {temp.map((w) => (
                                   <li key={w.id} onClick={() => {
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