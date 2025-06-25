import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";
import {useEffect, useState} from "react";
import Modal from "../../Modal";

const SearchSteamGame = ({defaultValue, active, setActive}) => {
    const [temp, setTemp] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setSearch(defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
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
                width: '600px',
                backgroundColor: 'var(--theme-color)',
                padding: 'var(--gap-half)',
                borderRadius: 'var(--border-radius)'
            }}>
                <Input label='Search'
                       name='search'
                       value={search}
                       onChange={({value}) => {
                           setSearch(value)
                       }}
                       children={(
                           <ul className={styles.search}>
                               {temp.map(({appid, name, logo}) => (
                                   <li key={appid} onClick={() => {
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