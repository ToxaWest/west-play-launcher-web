import electronConnector from "../../../helpers/electronConnector";
import formatBytes from "../../../helpers/formatSize";
import SteamData from "./SteamData";

const EgsFields = ({game, setGame}) => {

    const getGamePath = () => {
        electronConnector.getEgsId().then(({path, size, AppName}) => {
            const exePath = `com.epicgames.launcher://apps/${AppName}?action=launch&silent=true`;
            setGame(g => ({...g, path, size: formatBytes(parseInt(size)), exePath}))
        })
    }

    return (
        <SteamData game={game} setGame={setGame} getGamePath={getGamePath}/>
    )
}

export default EgsFields;