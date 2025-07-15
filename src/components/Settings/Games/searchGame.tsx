import React from "react";
import type {steamGridDbSearchResponse} from "@type/electron.types";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";
import Input from "../../Input";
import Modal from "../../Modal";

import styles from "../settings.module.scss";

const SearchGame = ({update, defaultValue}: {
    defaultValue: string;
    update: (e: {name: 'steamgriddb', value: number}) => void;
}) => {
    const [temp, setTemp] = React.useState<steamGridDbSearchResponse[]>([]);
    const [search, setSearch] = React.useState('');
    const [active, setActive] = React.useState(false);
    React.useEffect(() => {
        if (defaultValue) {
            setSearch(defaultValue);
        }
    }, [defaultValue]);

    const close = () => {
        setActive(false)
        setSearch('')
    }

    React.useEffect(() => {
        if (search.length > 2) {
            electronConnector.steamgriddbSearch({
                params: new URLSearchParams({term: search}).toString(),
            }).then(({data}) => {
                setTemp(data)
            })
        } else {
            setTemp([])
        }

    }, [search])

    return (
        <>
            <button tabIndex={1} type="button" onClick={() => setActive(true)}>{i18n.t('Update SteamGridDB')}</button>
            {active ?
                <Modal onClose={close} style={{zIndex: 30}}>
                    <div style={{
                        backgroundColor: 'var(--theme-color)',
                        borderRadius: 'var(--border-radius)',
                        padding: 'var(--gap-half)',
                        width: '600px'
                    }}>
                        <Input label={i18n.t('Search')}
                               value={search}
                               onChange={({value}) => {
                                   setSearch(value as string)
                               }}
                               children={(
                                   <ul className={styles.search}>
                                       {temp.map(({id, name, release_date}) => (
                                           <li key={id} role="button" onClick={() => {
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