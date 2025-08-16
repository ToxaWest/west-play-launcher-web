import React from "react";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
import Input from "../Input";
import Modal from "../Modal";

import styles from "./media.module.scss";

const MovieSearch = ({selectMovie}) => {
    const [temp, setTemp] = React.useState([]);
    const [active, setActive] = React.useState(false);
    const renderSearch = () => {
        return (
            <Input
                label={i18n.t('Search')}
                onChange={({value}) => {
                    if (value && (value as string).length > 2) electronConnector.movieSearch(value as string).then(setTemp)
                }}
                children={(
                    <ul className={styles.search}>
                        {temp.map(({title, href, description}) => (
                            <li key={href} role="button" tabIndex={1} onClick={() => {
                                setActive(false)
                                setTemp([])
                                selectMovie(href)
                            }}>
                                <span>{title} {description}</span>
                            </li>)
                        )}
                    </ul>
                )}
            />
        )
    }

    return <>
        <button tabIndex={1} type="button" onClick={() => setActive(true)}>{i18n.t('Search')}</button>
        {active ?
            <Modal onClose={() => {
                setActive(false)
                setTemp([])
            }} style={{backgroundColor: 'var(--theme-color-transparent)', zIndex: 30}}>
                <div style={{
                    backgroundColor: 'var(--theme-color)',
                    borderRadius: 'var(--border-radius)',
                    padding: 'var(--gap-half)',
                    width: '600px'
                }}>
                    {renderSearch()}
                </div>
            </Modal> : null}

    </>;
}

export default MovieSearch;