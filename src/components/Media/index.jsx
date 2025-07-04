import React, {useEffect} from "react";
import MoviePage from "./moviePage";
import electronConnector from "../../helpers/electronConnector";
import CatalogPage from "./catalogPage";

const Media = () => {
    const [url, setUrl] = React.useState(null);
    const [pageData, setPageData] = React.useState(null);

    useEffect(() => {
        electronConnector.getPageData('').then(setPageData)
    }, [])

    const updatePageUrl = (u) => {
        electronConnector.getPageData(u).then(setPageData)
    }

    if (url) return <MoviePage url={url} setUrl={setUrl} goTo={updatePageUrl}/>
    if (pageData) return <CatalogPage pageData={pageData} selectMovie={setUrl} goTo={updatePageUrl}/>
    return null
}

export default Media