import NewsRender from "../Game/newsRender";
import {useParams} from "react-router-dom";

const Steam_news = () => {
    const {id} = useParams();

    return <NewsRender id={id}/>
}

export default Steam_news