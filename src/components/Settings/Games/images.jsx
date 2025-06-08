import AddImage from "./addImage";
import electronConnector from "../../../helpers/electronConnector";
import useNotification from "../../../hooks/useNotification";

const Images = ({game, onChange, setLoading, setGame}) => {
    const notification = useNotification();

    const renderSteamAssets = () => {
        const {steamId} = game;
        if (steamId) {
            return <button tabIndex={1} onClick={() => {
                setLoading(true);
                notification({
                    img: game.img_icon || '/assets/controller/save.svg',
                    description: 'Please wait for end',
                    name: 'Getting images from steam',
                    status: 'warning'
                }, 3000)
                electronConnector.getSteamAssets({steamId}).then(data => {
                    setGame(g => ({...g, ...data}))
                    setLoading(false);
                    notification({
                        img: game.img_icon || '/assets/controller/save.svg',
                        description: 'Do not forgot save changes',
                        name: 'Images updated',
                        status: 'success'
                    }, 3000)
                })
            }}>Get steam Assets</button>
        }

        return null;
    }

    return (<>
        {renderSteamAssets()}
        {game.steamgriddb ?
            <>
                <AddImage id={game.id} game_id={game.steamgriddb} type="grid" onChange={onChange}
                          value={game.img_grid}/>
                <AddImage id={game.id} game_id={game.steamgriddb} type="hero" onChange={onChange}
                          value={game.img_hero}/>
                <AddImage id={game.id} game_id={game.steamgriddb} type="logo" onChange={onChange}
                          value={game.img_logo}/>
                <AddImage id={game.id} game_id={game.steamgriddb} type="icon" onChange={onChange}
                          value={game.img_icon}/>
            </>
            : null
        }</>)
}

export default Images