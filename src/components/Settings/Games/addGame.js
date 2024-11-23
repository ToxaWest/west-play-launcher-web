import {useRef, useState} from "react";
import AddImage from "./addImage";
import electronConnector from "../../../helpers/electronConnector";
import Input from "../../Input";
import SearchGame from "./searchGame";
import RyujinxFields from "./ryujinxFields";
import SteamFields from "./steamFields";
import useNotification from "../../../hooks/useNotification";
import Loader from "../../Loader";

const AddGame = ({data, submit, remove}) => {
    const [game, setGame] = useState(data);
    const [opened, setOpened] = useState(false)
    const wrapperRef = useRef(null);
    const notification = useNotification();
    const [loading, setLoading] = useState(false);
    const onChange = ({name, value}) => {
        setGame(g => ({...g, [name]: value}))
    }

    const update = (value) => {
        setLoading(true)
        notification({
            img: game.img_icon || '/assets/controller/save.svg',
            description: 'Please wait for end',
            name: 'Updating game data',
            status: 'warning'
        }, 3000)
        electronConnector.updateDataByFolder({path: value || game.path, id: game.id}).then((data) => {
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

    const imageName = () => (
        <Input label='Game Image'
               value={game.imageName}
               onChange={({value, name}) => {
                   if (value) {
                       onChange({name, value: value.split('/').at(-1)})
                   }
               }}
               type="path"
               onlyFile={true}
               name='imageName'>
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
                           onChange={({value, name}) => {
                               if (value) {
                                   onChange({name, value})
                                   update(value)
                               }
                           }}
                           type="path"
                           onlyFile={false}
                           name='path'>
                    </Input>
                    {renderByType()}
                    {renderSteamAssets()}
                    <AddImage id={game.steamgriddb} type="grid" onChange={onChange} value={game.img_grid}/>
                    <AddImage id={game.steamgriddb} type="hero" onChange={onChange} value={game.img_hero}/>
                    <AddImage id={game.steamgriddb} type="logo" onChange={onChange} value={game.img_logo}/>
                    <AddImage id={game.steamgriddb} type="icon" onChange={onChange} value={game.img_icon}/>
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
            {opened ? <div style={{position: 'relative'}}>
                <div style={{padding: 'var(--padding)', display: 'flex', gap: 'var(--gap)'}}>
                    <button tabIndex={1} onClick={() => remove()}>Remove game</button>
                    <button tabIndex={1} onClick={() => update()}>Update game</button>
                </div>
                {renderContent()}
                <Loader loading={loading}/>
            </div> : null}
        </details>
    )
}

export default AddGame;