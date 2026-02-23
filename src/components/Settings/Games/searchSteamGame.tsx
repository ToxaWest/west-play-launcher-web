import React from "react";
import type {SteamSearchResponse} from "@type/electron.types";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";
import Input from "../../Input";
import Modal from "../../Modal";

const SearchSteamGame = ({defaultValue, active, setActive}: {
    active: boolean;
    defaultValue: string;
    setActive: (active: boolean) => void;
}) => {
    const [temp, setTemp] = React.useState<SteamSearchResponse[]>([]);
    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        if (defaultValue) {
            setSearch(defaultValue);
        }
    }, [defaultValue]);

    React.useEffect(() => {
        if (search.length > 2) {
            electronConnector.gameSearch(search).then(setTemp)
        } else {
            setTemp([])
        }
    }, [search])

    const close = () => {
        setActive(false)
        setSearch('')
        electronConnector.receiveSteamId(null)
    }

    if (!active) return null;

    return (
        <Modal onClose={close} className="z-[30]">
            <div className="bg-theme rounded-theme p-gap-half w-[600px]">
                <Input label={i18n.t('Search')}
                       name='search'
                       value={search}
                       onChange={({value}) => {
                           setSearch(value as string)
                       }}
                       children={(
                           <ul className="flex flex-wrap my-gap mx-0 list-none gap-gap">
                               {temp.map(({appid, name, logo}) => (
                                   <li key={appid} role="button" 
                                       className="w-full flex p-gap-half rounded-theme cursor-pointer bg-theme-transparent items-center hover:bg-theme focus:bg-theme active:bg-theme"
                                       onClick={() => {
                                       setSearch('')
                                       setActive(false)
                                       electronConnector.receiveSteamId(appid)
                                   }}>
                                       <img src={logo} alt={name} className="max-w-[130px]"/>
                                       <span className="ml-gap-half">{name}</span>
                                   </li>)
                               )}
                           </ul>
                       )}
                />
                <button type='button' onClick={close}>Decline</button>
            </div>
        </Modal>

    )
}

export default SearchSteamGame;