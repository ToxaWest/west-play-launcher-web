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

    if (url) return <MoviePage url={url} setUrl={setUrl}/>
    if (pageData) return <CatalogPage pageData={pageData} selectMovie={setUrl} goTo={u => {
        electronConnector.getPageData(u).then(setPageData)
    }}/>
    return null
}

export default Media