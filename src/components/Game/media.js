import {useOutletContext, useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import RenderMedia from "./renderMedia";

const GamesMedia = () => {
    const {id} = useParams();
    const {audioRef} = useOutletContext();

    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);

    return <RenderMedia game={game} pause={() => {
        audioRef.play()
    }} play={() => {
        audioRef.pause()
    }}/>

}

export default GamesMedia