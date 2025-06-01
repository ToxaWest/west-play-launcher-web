import {useEffect, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import Input from "../../Input";
import styles from "../settings.module.scss";
import Modal from "../../Modal";

const SearchIGDB = ({update, defaultValue}) => {

    const [temp, setTemp] = useState([]);
    const [search, setSearch] = useState('');
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (defaultValue) {
            setSearch(defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
        if (search.length > 2 && active) {
            electronConnector.igdbSearch(search).then((result) => {
                setTemp(result)
                console.log(result)
            })
        } else {
            setTemp([])
        }

    }, [search, active])

    const close = () => {
        setActive(false)
        setSearch('')
    }

    return (
        <>
            <button tabIndex={1} onClick={() => setActive(true)}>Update IGDB</button>
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
                                       {temp.map(({game, name,published_at}) => (
                                           <li key={game} onClick={() => {
                                               setSearch('')
                                               update({
                                                   name: 'igdb',
                                                   value: {id: game}
                                               })
                                               electronConnector.igdbHltb(game)
                                                   .then((r) => {
                                                       update({
                                                           name: 'igdb',
                                                           value: {id: game, hltb: r[0]}
                                                       })
                                                       setActive(false)
                                                   })
                                           }}>
                                               <span>{name} {published_at ? `(${new Date(published_at * 1000).getFullYear()})` : ''}</span>
                                           </li>)
                                       )}
                                   </ul>
                               )}
                               name='search_igdb'/>
                    </div>
                </Modal> : null}
        </>

    )

}

export default SearchIGDB