import {useRef, useState} from "react";
import AddImage from "./addImage";
import formatBytes from "../../helpers/formatBytes";
import electronConnector from "../../helpers/electronConnector";
import Input from "../Input";
import SearchGame from "./searchGame";
import RyujinxFields from "./ryujinxFields";
import SteamFields from "./steamFields";

const AddGame = ({data, submit}) => {
    const [game, setGame] = useState(data);
    const wrapperRef = useRef(null);

    const onChange = ({name, value}) => {
        setGame(g => ({...g, [name]: value}))
    }

    const getGamePath = () => {
        electronConnector.getFolder().then(({path, size}) => {
            setGame(g => ({...g, path, size: formatBytes(size)}))
        })
    }

    const getExePath = () => {
        electronConnector.getFile().then(exePath => {
            setGame(g => ({...g, exePath}))
        })
    }

    const renderByType = () => {
        if (game.source === 'steam') {
            return <SteamFields game={game} onChange={onChange} setGame={setGame}/>
        }
        if (game.source === 'ryujinx') {
            return <RyujinxFields setGame={setGame} game={game} onChange={onChange}/>
        }
    }

    const renderContent = () => {
        if (game.steamgriddb) {
            return (
                <>
                    <Input label='Source'
                           value={game.source}
                           onChange={onChange}
                           type="select"
                           options={[
                               'steam',
                               'ryujinx'
                           ]}
                           name='source'/>
                    {renderByType()}
                    <Input label='Path'
                           value={game.path}
                           onChange={onChange}
                           name='path'>
                        <button onClick={() => getGamePath()}>Get Path</button>
                    </Input>
                    <Input label='Exe file path'
                           value={game.exePath}
                           onChange={onChange}
                           name='exePath'>
                        <button onClick={() => getExePath()}>Get EXE Path</button>
                    </Input>
                    <Input label='Image Name (overlay fix only)'
                           value={game.imageName}
                           onChange={onChange}
                           name='imageName'/>
                    <AddImage id={game.steamgriddb} type="grid" onChange={onChange} value={game.img_grid}/>
                    <AddImage id={game.steamgriddb} type="landscape" onChange={onChange} value={game.img_landscape}/>
                    <AddImage id={game.steamgriddb} type="hero" onChange={onChange} value={game.img_hero}/>
                    <AddImage id={game.steamgriddb} type="logo" onChange={onChange} value={game.img_logo}/>
                    <AddImage id={game.steamgriddb} type="icon" onChange={onChange} value={game.img_icon}/>
                    <button onClick={() => {
                        wrapperRef.current.open = false
                        submit(game)
                    }}>
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
                {renderContent()}
            </div>
        </details>
    )
}

export default AddGame;