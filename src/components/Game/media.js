import {useOutletContext, useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import RenderMedia from "./renderMedia";

const GamesMedia = () => {
    const {id} = useParams();
    const {
        audioPlay,
        audioStop
    } = useOutletContext();

    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);

    return <RenderMedia game={game} pause={audioPlay} play={audioStop}/>

}

export default GamesMedia