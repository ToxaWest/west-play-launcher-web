import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";
import {useEffect, useState} from "react";
import Modal from "../../Modal";

const SearchGame = ({update, defaultValue}) => {
    const [temp, setTemp] = useState([]);
    const [search, setSearch] = useState('');
    const [active, setActive] = useState(false);
    useEffect(() => {
        if (defaultValue) {
            setSearch(defaultValue);
        }
    }, [defaultValue]);

    const close = () => {
        setActive(false)
        setSearch('')
    }

    useEffect(() => {
        if (search.length > 2) {
            electronConnector.steamgriddbSearch({
                params: new URLSearchParams({
                    term: search
                }).toString(),
            }).then((result) => {
                setTemp(result.data)
            })
        } else {
            setTemp([])
        }

    }, [search])

    return (
        <>
            <button tabIndex={1} onClick={() => setActive(true)}>Update SteamGridDB</button>
            {active ?
                <Modal onClose={close} style={{zIndex: 30}}>
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
                                       {temp.map(({id, name, release_date}) => (
                                           <li key={id} onClick={() => {
                                               update({name: 'steamgriddb', value: id})
                                               close()
                                           }}>
                                               <span>{name} {release_date ? `(${new Date(release_date * 1000).getFullYear()})` : ''}</span>
                                           </li>)
                                       )}
                                   </ul>
                               )}
                               name='search'/>
                    </div>
                </Modal> : null}
        </>
    )
}

export default SearchGame;