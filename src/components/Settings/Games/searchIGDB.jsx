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
                                       {temp.map(({id, name}) => (
                                           <li key={id} onClick={() => {
                                               setSearch('')
                                               update({name: 'steamgriddb', value: id})
                                               electronConnector.igdbHltb(id)
                                                   .then(([{normally, hastily, completely}] = [{}]) => {
                                                       update({
                                                           name: 'igdb',
                                                           value: {
                                                               id: id,
                                                               hltb: {normally, hastily, completely}
                                                           }
                                                       })
                                                       setActive(false)
                                                   })
                                           }}>
                                               <span>{name}</span>
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