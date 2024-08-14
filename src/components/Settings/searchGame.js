import Input from "../Input";
import electronConnector from "../../helpers/electronConnector";
import styles from "./settings.module.scss";
import {useEffect, useState} from "react";

const SearchGame = ({update}) => {
    const [temp, setTemp] = useState([]);
    const [search, setSearch] = useState("");

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
            <Input label='Search'
                   onChange={({value}) => {
                       setSearch(value)
                   }}
                   children={(
                       <ul className={styles.search}>
                           {temp.map(({id, name, release_date}) => (
                               <li key={id} onClick={() => {
                                   setSearch('')
                                   update({name, id, steamgriddb: id})
                               }}>
                                   <span>{name} ({new Date(release_date * 1000).getFullYear()})</span>
                               </li>)
                           )}
                       </ul>
                   )}
                   name='search'/>
        </>
    )
}

export default SearchGame;