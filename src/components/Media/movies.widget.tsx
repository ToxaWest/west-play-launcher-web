import React from "react";
import {createSearchParams,useNavigate} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";
import {MovieStorageHistory} from "../../types/movieStorage.types";

import movieStorage from "./movieStorage";

import styles from './media.module.scss';
const MoviesWidget = () => {
    const navigate = useNavigate();

    if(getFromStorage('config').settings.showMoviesWidget === 0) return null;


    const renderItem = (item: MovieStorageHistory) => (
        <li key={item.href} tabIndex={1} role="button"
            onClick={() => {
                navigate({
                    pathname: 'movie',
                    search: `?${createSearchParams({url: item.href})}`,
                })
            }}
        >
            <img src={item.image} alt={item.title}/>
        </li>
    )

    return <React.Fragment>
        <h2>Movies</h2>
        <ul className={styles.widget}>
            {movieStorage.history.map(renderItem)}
        </ul>
    </React.Fragment>;
}

export default MoviesWidget;