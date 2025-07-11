import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

import MoviePage from "./moviePage";

const MoviePageRouter = () => {

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const url = searchParams.get('url')
    const backFallback = () => {
        navigate('/')
    }

    if (!url) {
        backFallback()
        return null
    }

    return React.createElement(MoviePage, {
        goTo: backFallback,
        setUrl: backFallback,
        url
    })
}

export default MoviePageRouter