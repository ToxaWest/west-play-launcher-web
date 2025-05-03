import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import NewsRender from "./newsRender";

const News = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    return <NewsRender id={game.steamId}/>

}

export default News;