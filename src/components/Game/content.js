import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import RenderContent from "./renderContent";
import {secondsToHms} from "../../hooks/usePlayTime";

const GameContent = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const lastPlayed = getFromStorage('lastPlayed')[game.id];
    const playTime = getFromStorage('playTime')[game.id];

    return <RenderContent game={game} fields={[{
        label: 'Last played',
        value: lastPlayed ? new Date(lastPlayed).toLocaleDateString() : null
    }, {
        label: 'Play time',
        value: playTime ? secondsToHms(playTime) : null
    }, {
        label: 'Size',
        value: game.size
    }]}/>

}

export default GameContent