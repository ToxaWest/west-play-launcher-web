import {useRef, useState} from "react";
import AddImage from "./addImage";
import electronConnector from "../../../helpers/electronConnector";
import Input from "../../Input";
import SearchGame from "./searchGame";
import RyujinxFields from "./ryujinxFields";
import SteamFields from "./steamFields";
import formatBytes from "../../../helpers/formatSize";
import AddAudio from "./addAudio";
import useNotification from "../../../hooks/useNotification";

const AddGame = ({data, submit, remove}) => {
    const [game, setGame] = useState(data);
    const [opened, setOpened] = useState(false)
    const wrapperRef = useRef(null);
    const notification = useNotification();

    const [loading, setLoading] = useState(false);
    const onChange = ({name, value}) => {
        setGame(g => ({...g, [name]: value}))
    }

    const getGamePathV2 = () => {
        setLoading(true)
        notification({
            img: '/assets/controller/save.svg',
            description: 'Please wait for end',
            name: 'Getting data from folder',
            status: 'warning'
        }, 5000)
        electronConnector.getDataByFolder(game.id).then((data) => {
            const {size, ...gameData} = data;
            setGame(g => ({...g, ...gameData, size: formatBytes(parseInt(size))}))
            setLoading(false)
            notification({
                img: '/assets/controller/save.svg',
                description: 'Do not forgot save changes',
                name: 'Data received',
                status: 'success'
            }, 3000)
        })
    }

    const update = () => {
        setLoading(true)
        notification({
            img: game.img_icon || '/assets/controller/save.svg',
            description: 'Please wait for end',
            name: 'Updating game data',
            status: 'warning'
        }, 3000)
        electronConnector.updateDataByFolder({path: game.path, id: game.id}).then((data) => {
            setGame(g => ({...g, ...data}))
            setLoading(false)
            notification({
                img: game.img_icon || '/assets/controller/save.svg',
                description: 'Do not forgot save changes',
                name: 'Data updated',
                status: 'success'
            }, 3000)
        })
    }

    const getImage = () => {
        electronConnector.getFile().then(p => {
            const imageName = p.split('\\').at(-1);
            onChange({name: 'imageName', value: imageName})
        })
    }

    const imageName = () => (
        <Input label='Game Image (dangerous)'
               value={game.imageName}
               disabled={true}
               name='imageName'>
            <button onClick={() => getImage()}>Get imageName</button>
        </Input>
    )

    const renderByType = () => {
        if (game.source === 'steam') {
            return <>
                {imageName()}
                <SteamFields game={game} onChange={onChange}/>
            </>
        }

        if (game.source === 'ryujinx') {
            return <RyujinxFields game={game} onChange={onChange}/>
        }

        if (game.source === 'egs') {
            return <>
                {imageName()}
                <SteamFields game={game} onChange={onChange}/>
            </>
        }

        if (game.source === 'origin') {
            return imageName()
        }

        return null;
    }

    const renderSteamAssets = () => {
        const {steamId, steamgriddb} = game;
        if (steamId && steamgriddb) {
            return <button tabIndex={1} onClick={() => {
                setLoading(true);
                notification({
                    img: game.img_icon || '/assets/controller/save.svg',
                    description: 'Please wait for end',
                    name: 'Getting images from steam',
                    status: 'warning'
                }, 3000)
                electronConnector.getSteamAssets({steamId, steamgriddb}).then(data => {
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

    const renderContent = () => {
        if (game.steamgriddb) {
            return (
                <>
                    <Input label='Path'
                           value={game.path}
                           disabled={true}
                           name='path'>
                        <button onClick={() => getGamePathV2()}>Get Path</button>
                    </Input>
                    {renderByType()}
                    {renderSteamAssets()}
                    <AddImage id={game.steamgriddb} type="grid" onChange={onChange} value={game.img_grid}/>
                    <AddImage id={game.steamgriddb} type="landscape" onChange={onChange} value={game.img_landscape}/>
                    <AddImage id={game.steamgriddb} type="hero" onChange={onChange} value={game.img_hero}/>
                    <AddImage id={game.steamgriddb} type="logo" onChange={onChange} value={game.img_logo}/>
                    <AddImage id={game.steamgriddb} type="icon" onChange={onChange} value={game.img_icon}/>
                    <AddAudio id={game.steamgriddb} onChange={onChange} name={game.name} value={game.audio}/>
                    <button tabIndex={1} onClick={() => {
                        submit(game)
                        wrapperRef.current.open = false
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
        <details ref={wrapperRef} onToggle={() => {
            setOpened(wrapperRef.current.open)
        }}>
            <summary tabIndex={1} onClick={() => {
                setOpened(wrapperRef.current.open)
            }}>
                {game.name}
            </summary>
            {opened ? <div>
                <div style={{padding: 'var(--padding)', display: 'flex', gap: 'var(--gap)'}}>
                    <button tabIndex={1} onClick={() => remove()}>Remove game</button>
                    <button tabIndex={1} onClick={() => update()}>Update game</button>
                </div>
                {renderContent()}
            </div> : null}
        </details>
    )
}

export default AddGame;