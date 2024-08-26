import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import RenderContent from "./renderContent";

const GameContent = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const lastPlayed = getFromStorage('lastPlayed')[id];
    const playTime = getFromStorage('playTime')[id];

    return <RenderContent game={game} lastPlayed={lastPlayed} playTime={playTime} />

}

export default GameContent