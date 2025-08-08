import React from "react";
import useFooterActions from "@hook/useFooterActions";
import type {getPageData} from "@type/electron.types";
import type {MovieStorageHistory} from "@type/movieStorage.types";
import {useNavigate, useSearchParams} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import Loader from "../Loader";

import CatalogPage from "./catalogPage";
import movieStorage from "./movieStorage";

const Media = () => {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const url = searchParams.get('url')

    const [loading, setLoading] = React.useState(true)
    const [pageData, setPageData] = React.useState<getPageData>(null);
    const [history, setHistory] = React.useState<MovieStorageHistory[]>(movieStorage.history)
    const {setFooterActions} = useFooterActions()
    React.useEffect(() => {
        if (getFromStorage('movies').authorized) electronConnector.getMoviesHistory().then(setHistory)
        setFooterActions({})
    }, [])

    React.useEffect(() => {
        setLoading(true)
        electronConnector.getPageData(url || '').then((d) => {
            setPageData(d);
            setLoading(false)
        })
    }, [url])

    const updatePageUrl = (pageUrl: string) => {
        navigate(`/media?url=${pageUrl}`)
    }

    const setUrl = (url: string) => {
        navigate(`/movie?url=${url}`)
    }

    return <>
        {pageData ?
            <CatalogPage pageData={pageData} selectMovie={setUrl} goTo={updatePageUrl} history={history}/> : null}
        <Loader loading={loading}/>
    </>
}

export default Media