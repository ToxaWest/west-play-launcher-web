import electronConnector from "../../../helpers/electronConnector";
import formatBytes from "../../../helpers/formatSize";
import SteamData from "./SteamData";
import Input from "../../Input";

const EgsFields = ({game, setGame, setLoading}) => {

    const getGamePath = () => {
        setLoading(true);
        electronConnector.getEgsId().then(({path, size, AppName, CatalogNamespace}) => {
            const exePath = `com.epicgames.launcher://apps/${AppName}?action=launch&silent=true`;
            setGame(g => ({...g, path, size: formatBytes(parseInt(size)), exePath}))
            setLoading(false)
            getAchievements(CatalogNamespace)
        })
    }

    const getAchievements = (sandboxId) => {
        if (sandboxId) {
            setLoading(true);
            electronConnector.getEpicGamesAchievements({sandboxId}).then(({achievements: r, productId}) => {
                if (!r) {
                    setGame(g => ({...g, achievements: null, sandboxId, achPath: null}))
                    setLoading(false)
                    return;
                }
                const achievements = []
                const getType = (t) => {
                    const mapping = {
                        'bronze': 'B',
                        'gold': 'G',
                        'silver': 'S',
                        'platinum': 'P',
                    }
                    return mapping[t]
                }
                r.forEach(({achievement}) => {
                    achievements.push({
                        defaultvalue: 0,
                        description: achievement.unlockedDescription,
                        displayName: achievement.unlockedDisplayName,
                        hidden: achievement.hidden ? 1 : 0,
                        type: getType(achievement.tier.name),
                        icon: achievement.unlockedIconLink,
                        icongray: achievement.lockedIconLink,
                        name: achievement.name
                    })
                })
                setGame(g => ({...g, achievements, sandboxId, productId, achPath: null}))
                setLoading(false)
            })
        }
    }

    return (
        <>
            <SteamData game={game} setGame={setGame}/>
            <Input label='Path'
                   value={game.path}
                   disabled={true}
                   name='path'>
                <button onClick={() => getGamePath()}>Get Folder</button>
            </Input>
        </>
    )
}

export default EgsFields;