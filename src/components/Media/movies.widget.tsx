import React from "react";
import {MovieStorageHistory} from "@type/movieStorage.types";
import {createSearchParams,useNavigate} from "react-router-dom";

import i18n from "../../helpers/translate";

import movieStorage from "./movieStorage";

const MoviesWidget = () => {
    const navigate = useNavigate();

    const renderItem = (item: MovieStorageHistory) => (
        <li key={item.href} tabIndex={1} role="button"
            className="min-w-0 w-[12vw] overflow-hidden cursor-pointer rounded-theme relative transition-all duration-300 ease-in-out perspective-[1000px] hover:z-[2] hover:translate-x-[calc(1.8vw-var(--gap))] hover:scale-115 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:z-[2] active:translate-x-[calc(1.8vw-var(--gap))] active:scale-115 active:shadow-[0_10px_20px_rgba(0,0,0,0.5)] focus:z-[2] focus:translate-x-[calc(1.8vw-var(--gap))] focus:scale-115 focus:shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            onClick={() => {
                navigate({
                    pathname: '/movie',
                    search: `?${createSearchParams({url: item.href})}`,
                })
            }}
        >
            <img src={item.image} alt={item.title} className="aspect-[83/125] min-w-0 w-full h-full object-cover"/>
        </li>
    )

    if(movieStorage.favorites.length === 0) return null

    return <React.Fragment>
        <h2 className="p-theme relative z-[2]">{i18n.t('Movies')}</h2>
        <div className="w-screen glass">
            <ul className="gap-gap grid grid-rows-[repeat(1,1fr)] justify-start grid-flow-col overflow-x-auto list-none relative py-[1.5vw] px-gap min-h-[80px]">
                {movieStorage.favorites.reverse().map(renderItem)}
            </ul>
        </div>
    </React.Fragment>;
}

export default MoviesWidget;