import {useRef, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import Input from "../../Input";
import RyujinxFields from "./ryujinxFields";
import SteamFields from "./steamFields";
import useNotification from "../../../hooks/useNotification";
import Loader from "../../Loader";
import Images from "./images";
import Modal from "../../Modal";
import SearchSteamGame from "./searchSteamGame";

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
    const update = (value) => {
        setLoading(true)
        notification({
            img: game.img_icon || '/assets/controller/save.svg',
            description: 'Please wait for end',
            name: 'Updating game data',
            status: 'warning'
        }, 3000)
        electronConnector.getSteamId(({searchParams}) => {
            setSearch(searchParams)
            setActive(true)
        })
        electronConnector.updateDataByFolder({path: value || game.path, id: game.id}).then((data) => {
            setGame(g => ({...g, ...data}))
            setLoading(false)
            notification({
                img: game.img_icon || '/assets/controller/save.svg',
                description: 'Do not forgot save changes',
                name: 'Data updated',
                status: 'success'
            }, 3000)
            window.api.removeAllListeners('getSteamId')
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

    const renderContent = () => {
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
                <Images game={game} onChange={onChange} setGame={setGame} setLoading={setLoading}/>
                {game.unofficial && <Input label='Download link'
                                           value={game.downloadLink}
                                           onChange={onChange}
                                           name='downloadLink'>
                </Input>}

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
    }

    const close = () => {
        setActive(false)
        setSearch('')
        electronConnector.receiveSteamId(null)
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
                {active ? <Modal onClose={close} style={{zIndex: 30}}>
                    <div>
                        <SearchSteamGame defaultValue={search} update={e => {
                            setActive(false)
                            setSearch('')
                            electronConnector.receiveSteamId(e)
                        }}/>
                    </div>
                </Modal> : null}
                <Loader loading={loading}/>
            </div> : null}
        </details>
    )
}

export default AddGame;