import {useRef, useState} from "react";
import AddImage from "./addImage";
import electronConnector from "../../../helpers/electronConnector";
import Input from "../../Input";
import SearchGame from "./searchGame";
import RyujinxFields from "./ryujinxFields";
import SteamFields from "./steamFields";
import Rpcs3Fields from "./rpcs3Fields";
import EgsFields from "./egsFields";
import formatBytes from "../../../helpers/formatSize";
import {getFromStorage} from "../../../helpers/getFromStorage";
import AddAudio from "./addAudio";

const AddGame = ({data, submit, remove}) => {
    const [game, setGame] = useState(data);
    const wrapperRef = useRef(null);
    const {rpcs3, ryujinx} = getFromStorage('config').settings

    const [loading, setLoading] = useState(false);
    const onChange = ({name, value}) => {
        setGame(g => ({...g, [name]: value}))
    }

    const getGamePath = () => {
        setLoading(true)
        electronConnector.getFolder().then(({path, size}) => {
            setGame(g => ({...g, path, size: formatBytes(parseInt(size))}))
            setLoading(false)
        })
    }

    const renderByType = () => {
        const props = {
            game,
            setGame,
            setLoading
        }
        if (game.source === 'steam') {
            return <SteamFields {...props} onChange={onChange} getGamePath={getGamePath}/>
        }
        if (game.source === 'ryujinx') {
            return <RyujinxFields {...props} getGamePath={getGamePath}/>
        }
        if (game.source === 'rpcs3') {
            return <Rpcs3Fields {...props} getGamePath={getGamePath}/>
        }
        if (game.source === 'egs') {
            return <EgsFields {...props}/>
        }
    }

    const options = [
        'steam',
        'egs',
        ryujinx ? 'ryujinx' : null,
        rpcs3 ? 'rpcs3' : null,
    ].filter(a => a)


    const renderContent = () => {
        if (game.steamgriddb) {
            return (
                <>
                    <Input label='Source'
                           value={game.source}
                           onChange={onChange}
                           type="select"
                           options={options}
                           name='source'/>
                    {renderByType()}
                    <AddImage id={game.steamgriddb} type="grid" onChange={onChange} value={game.img_grid}/>
                    <AddImage id={game.steamgriddb} type="landscape" onChange={onChange} value={game.img_landscape}/>
                    <AddImage id={game.steamgriddb} type="hero" onChange={onChange} value={game.img_hero}/>
                    <AddImage id={game.steamgriddb} type="logo" onChange={onChange} value={game.img_logo}/>
                    <AddImage id={game.steamgriddb} type="icon" onChange={onChange} value={game.img_icon}/>
                    <AddAudio id={game.steamgriddb} onChange={onChange} name={game.name} value={game.audio}/>
                    <button onClick={() => {
                        wrapperRef.current.open = false
                        submit(game)
                    }}
                            disabled={loading}
                    >
                        submit
                    </button>
                </>
            )
        } else {
            return <SearchGame data={game} update={setGame}/>
        }
    }

    return (
        <details ref={wrapperRef}>
            <summary>
                {game.name}
            </summary>
            <div>
                <button onClick={() => remove()}>Remove game</button>
                {renderContent()}
            </div>
        </details>
    )
}

export default AddGame;