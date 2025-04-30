import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";
import {useEffect, useState} from "react";

const SearchSteamGame = ({update, defaultValue}) => {
    const [temp, setTemp] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setSearch(defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
        if (search.length > 2) {
            electronConnector.gameSearch({
                query: search,
                source: 'steam',
            }).then((result) => {
                setTemp(result)
            })
        } else {
            setTemp([])
        }

    }, [search])

    return (
        <div style={{
            width: '600px',
            backgroundColor: 'var(--theme-color)',
            padding: 'var(--gap-half)',
            borderRadius: 'var(--border-radius)'
        }}>
            <Input label='Search'
                   value={search}
                   onChange={({value}) => {
                       setSearch(value)
                   }}
                   children={(
                       <ul className={styles.search}>
                           {temp.map(({appid, name, logo}) => (
                               <li key={appid} onClick={() => {
                                   setSearch('')
                                   update(appid)
                               }}>
                                   <img src={logo} alt={name} />
                                   <span>{name}</span>
                               </li>)
                           )}
                       </ul>
                   )}
                   name='search'/>
            <button type='button' onClick={() => {
                update(null)
            }}>Decline</button>
        </div>
    )
}

export default SearchSteamGame;