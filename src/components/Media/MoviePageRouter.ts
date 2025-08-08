import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

import MoviePage from "./moviePage";

const MoviePageRouter = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const url = searchParams.get('url')

    if (!url) {
        navigate(-1)
        return null
    }

    return React.createElement(MoviePage, {url})
}

export default MoviePageRouter