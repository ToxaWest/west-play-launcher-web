import React from "react";
import type {getPageData} from "@type/electron.types";

import electronConnector from "../../helpers/electronConnector";

import CatalogPage from "./catalogPage";
import MoviePage from "./moviePage";

const Media = () => {
    const [url, setUrl] = React.useState<string>(null);
    const [pageData, setPageData] = React.useState<getPageData>(null);

    React.useEffect(() => {
        electronConnector.getPageData('').then(setPageData)
    }, [])

    const updatePageUrl = (pageUrl: string) => {
        electronConnector.getPageData(pageUrl).then(setPageData)
    }

    if (url) return <MoviePage url={url} setUrl={setUrl} goTo={updatePageUrl}/>
    if (pageData) return <CatalogPage pageData={pageData} selectMovie={setUrl} goTo={updatePageUrl}/>
    return null
}

export default Media