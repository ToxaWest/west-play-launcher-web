import React from "react";
import useFooterActions from "@hook/useFooterActions";

import {getFromStorage} from "../../helpers/getFromStorage";
import MoviesWidget from "../Media/movies.widget";

import CrackedWidget from "./cracked.widget";
import FreeWidget from "./free.widget";
import PlayedWidget from "./played.widget";

import styles from "./home.module.scss";

const Home = () => {
    const {setFooterActions} = useFooterActions()
    const {
        showFreeWidget,
        showCrackedWidget,
        showMoviesWidget
    } = getFromStorage('config').settings;

    React.useEffect(() => {
        setFooterActions({})
    }, [])


    return (
        <div className={styles.innerWrapper}>
            <PlayedWidget/>
            {showFreeWidget === 1 && <FreeWidget/>}
            {showCrackedWidget === 1 && <CrackedWidget/>}
            {showMoviesWidget === 1 && <MoviesWidget/>}
        </div>
    )
}

export default Home;