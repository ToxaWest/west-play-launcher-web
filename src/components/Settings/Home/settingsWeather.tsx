import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Input from "../../Input";

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
            <Input label={i18n.t("City")}
                   onChange={({value}) => {
                       setTemp([]);
                       setSearch(value as string);
                   }}
                   children={(
                       <div className="w-full">
                           <span>{settings.name} ({settings?.sys?.country})</span>
                           <ul className="flex flex-wrap m-0 p-0 list-none gap-gap">
                               {temp.map((w) => (
                                   <li key={w.id} role="button" 
                                       className="w-full flex p-gap-half rounded-theme cursor-pointer bg-theme-transparent items-center hover:bg-theme focus:bg-theme active:bg-theme"
                                       onClick={() => {
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
                       </div>

                   )}
            />
        </div>
    )
}

export default SettingsWeather