import React from "react";
import type {HLTBSearchResponse} from "@type/electron.types";
import type {HLTBType} from "@type/game.types";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";
import Input from "../../Input";
import Modal from "../../Modal";

import styles from "../settings.module.scss";

const SearchHLTB = ({update, defaultValue}: {
    update: (e: { name: 'hltb', value: HLTBType }) => void;
    defaultValue: string
}) => {
    const [temp, setTemp] = React.useState<HLTBSearchResponse[]>([]);
    const [search, setSearch] = React.useState('');
    const [active, setActive] = React.useState(false);

    React.useEffect(() => {
        if (defaultValue) {
            setSearch(defaultValue);
        }
    }, [defaultValue]);

    React.useEffect(() => {
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
        <React.Fragment>
            <button tabIndex={1} type="button" onClick={() => setActive(true)}>{i18n.t('Update HLTB')}</button>
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
                                           <li key={id.toString()} role="button" onClick={() => {
                                               setSearch('')
                                               update({
                                                   name: 'hltb',
                                                   value: {
                                                       allStylesTime,
                                                       completionistTime,
                                                       mainExtraTime,
                                                       mainTime
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
        </React.Fragment>
    )

}

export default SearchHLTB