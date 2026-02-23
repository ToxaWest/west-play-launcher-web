import React from "react";
import type {steamGridDbSearchResponse} from "@type/electron.types";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";
import Input from "../../Input";
import Modal from "../../Modal";

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
                <Modal onClose={close} className="z-[30]">
                    <div className="bg-theme rounded-theme p-gap-half w-[600px]">
                        <Input label={i18n.t('Search')}
                               value={search}
                               onChange={({value}) => {
                                   setSearch(value as string)
                               }}
                               children={(
                                   <ul className="flex flex-wrap my-gap mx-0 list-none gap-gap">
                                       {temp.map(({id, name, release_date}) => (
                                           <li key={id} role="button" 
                                               className="w-full flex p-gap-half rounded-theme cursor-pointer bg-theme items-center focus:bg-text focus:text-theme hover:bg-text hover:text-theme active:bg-text active:text-theme"
                                               onClick={() => {
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