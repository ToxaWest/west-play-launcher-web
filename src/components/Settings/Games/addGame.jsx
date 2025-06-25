import {useRef, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import Input from "../../Input";
import RyujinxFields from "./ryujinxFields";
import SteamFields from "./steamFields";
import useNotification from "../../../hooks/useNotification";
import Loader from "../../Loader";
import Images from "./images";
import SearchSteamGame from "./searchSteamGame";
import SearchHLTB from "./searchHLTB";
import SearchGame from "./searchGame";
import {getFromStorage} from "../../../helpers/getFromStorage";

const AddGame = ({data, submit, remove}) => {
    const [game, setGame] = useState(data);
    const [opened, setOpened] = useState(false)
    const wrapperRef = useRef(null);
    const notification = useNotification();
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);
    const [search, setSearch] = useState("");
    const onChange = ({name, value}) => {
        setGame(g => ({...g, [name]: value}))
    }
    const update = async () => {
        setLoading(true)
        notification({
            img: game.img_icon || '/assets/controller/save.svg',
            description: 'Please wait for end',
            name: 'Updating game data',
            status: 'warning'
        }, 3000)
        if(game.source === 'gog' || game.source === 'egs'){
            electronConnector.getSteamId(({searchParams}) => {
                setSearch(searchParams)
                setActive(true)
            })
        }

        const additional = await electronConnector.getDataByGameId(game)
        setGame((g) => ({...g, ...additional}))
        if(game.source === 'gog' || game.source === 'egs'){
            window.api.removeAllListeners('getSteamId')
        }
        setLoading(false)
    }

    const getGameByFolder = async (folderId) => {
        setLoading(true)
        const data = await electronConnector.getGameByFolder(folderId);
        if (!data) {
            setLoading(false)
            notification({
                img: game.img_icon || '/assets/controller/save.svg',
                description: 'Folder does not have required game files',
                name: 'Game not found',
                status: 'warning'
            }, 3000);
            return;
        }
        if(getFromStorage('games').some(({id}) => id === data.id)){
            setLoading(false)
            notification({
                img: game.img_icon || '/assets/controller/save.svg',
                description: `Game with id ${data.id} already exists`,
                name: 'Game already exists',
                status: 'warning'
            }, 3000);
            return;
        }

        if(data.source === 'gog' || data.source === 'egs'){
            electronConnector.getSteamId(({searchParams}) => {
                setSearch(searchParams)
                setActive(true)
            })
        }

        const additional = await electronConnector.getDataByGameId(data)
        setGame((g) => ({...g, ...data, ...additional}))
        if(data.source === 'gog' || data.source === 'egs'){
            window.api.removeAllListeners('getSteamId')
        }
        setLoading(false)
    }

    const render = {
        howLongToBeat: () => <SearchHLTB defaultValue={game.name} update={onChange}/>,
        steamGridDB: () => <SearchGame defaultValue={game.name} update={onChange}/>,
        remove: () => <button tabIndex={1} onClick={remove}>Remove game</button>,
        update: () => <button tabIndex={1} onClick={update}>Update game</button>,
        imageName: () => <div style={{display: 'flex', gap: 'var(--gap)'}}>
            <Input label='Game Image'
                   value={game.imageName}
                   onChange={({value, name}) => {
                       if (value) {
                           onChange({name, value: value.split('/').at(-1)})
                       }
                   }}
                   type="path"
                   onlyFile={true}
                   initial={game.path}
                   name='imageName'>
            </Input>
            <button onClick={() => {
                onChange({name: 'imageName', value: ''})
            }}>Clear
            </button>
        </div>,
        ryujinxFields: () => <RyujinxFields game={game} onChange={onChange}/>,
        path: () => <Input label='Path'
                           value={game.path}
                           onChange={({value, name}) => {
                               if (value) {
                                   onChange({name, value})
                                   getGameByFolder(value)
                               }
                           }}
                           type="path"
                           onlyFile={false}
                           name='path'/>,
        version: () => <Input label='Version' value={game.buildVersion} onChange={onChange} name='buildVersion'/>,
        images: () => <Images game={game} onChange={onChange} setGame={setGame} setLoading={setLoading}/>,
        download: () => <Input label='Download link' value={game.downloadLink} onChange={onChange}
                               name='downloadLink'/>,
        steamFields: () => <SteamFields game={game} onChange={onChange}/>
    }

    const renderByType = () => {
        if (game.source === 'ryujinx') {
            return (
                <>
                    {render.ryujinxFields()}
                    {render.version()}
                </>
            )
        }

        if (game.source === 'steam') {
            if (game.unofficial) {
                return (
                    <>
                        {render.path()}
                        {render.imageName()}
                        {render.steamFields()}
                        {render.version()}
                    </>
                )
            }
            return (
                <>
                    {render.imageName()}
                </>
            )
        }

        if (game.source === 'egs') {
            if (game.unofficial) {
                return (
                    <>
                        {render.path()}
                        {render.steamFields()}
                    </>
                )
            }
            return (
                <>

                </>
            )
        }

        return null
    }

    const renderContent = () => {
        return (
            <>
                {!game.path && render.path()}
                {renderByType()}
                {render.images()}
                {game.unofficial && render.download()}
                <button tabIndex={1}
                        disabled={loading}
                        onClick={() => {
                            submit(game)
                            wrapperRef.current.open = false
                        }}
                >
                    submit
                </button>
            </>
        )
    }

    return (
        <details ref={wrapperRef} onToggle={() => {
            setOpened(wrapperRef.current.open)
        }}>
            <summary tabIndex={1} onClick={() => {
                setOpened(wrapperRef.current.open)
            }}>{game.name}</summary>
            {opened ? <div style={{position: 'relative'}}>
                <div style={{padding: 'var(--padding)', display: 'flex', gap: 'var(--gap)'}}>
                    {render.remove()}
                    {(game.source !== 'ryujinx') ? render.update() : null}
                    {game.name && render.howLongToBeat()}
                    {game.name && render.steamGridDB()}
                </div>
                {renderContent()}
                <SearchSteamGame defaultValue={search} active={active} setActive={setActive}/>
                <Loader loading={loading}/>
            </div> : null}
        </details>
    )
}

export default AddGame;