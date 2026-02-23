import React from "react";

import electronConnector from "../../helpers/electronConnector";
import i18n from "../../helpers/translate";
import Input from "../Input";
import Modal from "../Modal";

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
                    <ul className="flex flex-wrap my-gap mx-0 p-theme list-none gap-gap">
                        {temp.map(({title, href, description}) => (
                            <li key={href} role="button" tabIndex={1} 
                                className="w-full flex p-gap-half rounded-theme cursor-pointer bg-theme items-center focus:bg-text focus:text-theme hover:bg-text hover:text-theme active:bg-text active:text-theme"
                                onClick={() => {
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
            }} className="bg-theme-transparent z-[30]">
                <div className="bg-theme rounded-theme p-gap-half w-[600px]">
                    {renderSearch()}
                </div>
            </Modal> : null}

    </>;
}

export default MovieSearch;