import React from "react";
import {MovieStorageHistory} from "@type/movieStorage.types";
import {createSearchParams,useNavigate} from "react-router-dom";

import i18n from "../../helpers/translate";

import movieStorage from "./movieStorage";

import styles from './media.module.scss';
const MoviesWidget = () => {
    const navigate = useNavigate();

    const renderItem = (item: MovieStorageHistory) => (
        <li key={item.href} tabIndex={1} role="button"
            onClick={() => {
                navigate({
                    pathname: '/movie',
                    search: `?${createSearchParams({url: item.href})}`,
                })
            }}
        >
            <img src={item.image} alt={item.title}/>
        </li>
    )

    if(movieStorage.favorites.length === 0) return null

    return <React.Fragment>
        <h2>{i18n.t('Movies')}</h2>
        <ul className={styles.widget}>
            {movieStorage.favorites.reverse().map(renderItem)}
        </ul>
    </React.Fragment>;
}

export default MoviesWidget;