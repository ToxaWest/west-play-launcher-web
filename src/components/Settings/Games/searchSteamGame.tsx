import React from "react";
import type {SteamSearchResponse} from "@type/electron.types";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";
import Input from "../../Input";
import Modal from "../../Modal";

import styles from "../settings.module.scss";

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
        <Modal onClose={close} style={{zIndex: 30}}>
            <div style={{
                backgroundColor: 'var(--theme-color)',
                borderRadius: 'var(--border-radius)',
                padding: 'var(--gap-half)',
                width: '600px'
            }}>
                <Input label={i18n.t('Search')}
                       name='search'
                       value={search}
                       onChange={({value}) => {
                           setSearch(value as string)
                       }}
                       children={(
                           <ul className={styles.search}>
                               {temp.map(({appid, name, logo}) => (
                                   <li key={appid} role="button" onClick={() => {
                                       setSearch('')
                                       setActive(false)
                                       electronConnector.receiveSteamId(appid)
                                   }}>
                                       <img src={logo} alt={name}/>
                                       <span>{name}</span>
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