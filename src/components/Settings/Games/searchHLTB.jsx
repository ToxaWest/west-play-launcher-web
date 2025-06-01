import {useEffect, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import Input from "../../Input";
import styles from "../settings.module.scss";
import Modal from "../../Modal";

const SearchHLTB = ({update, defaultValue}) => {

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
            electronConnector.howLongToBeat(search).then(setTemp)
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
            <button tabIndex={1} onClick={() => setActive(true)}>Update HLTB</button>
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
                                       {temp.map(({
                                                      id,
                                                      name,
                                                      mainTime,
                                                      mainExtraTime,
                                                      completionistTime,
                                                      allStylesTime,
                                                      releaseYear,
                                                      type
                                                  }) => (
                                           <li key={id} onClick={() => {
                                               setSearch('')
                                               update({
                                                   name: 'hltb',
                                                   value: {
                                                       mainTime,
                                                       mainExtraTime,
                                                       completionistTime,
                                                       allStylesTime
                                                   }
                                               })
                                               setActive(false)
                                           }}>
                                               <span>{name} {releaseYear ? `(${releaseYear})` : ''} {type ? `(${type})` : ''}</span>
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

export default SearchHLTB