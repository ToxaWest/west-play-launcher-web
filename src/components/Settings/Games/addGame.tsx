import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage} from "../../../helpers/getFromStorage";
import useNotification from "../../../hooks/useNotification";
import type {Game} from "../../../types/game.types";
import Input from "../../Input";
import Loader from "../../Loader";

import Images from "./images";
import RyujinxFields from "./ryujinxFields";
import SearchGame from "./searchGame";
import SearchHLTB from "./searchHLTB";
import SearchSteamGame from "./searchSteamGame";
import SteamFields from "./steamFields";

import styles from '../settings.module.scss';

const AddGame = ({data, submit, remove}: {
    data: Game;
    submit: (game: Game) => void;
    remove: () => void;
}) => {
    const [game, setGame] = React.useState(data);
    const notification = useNotification();
    const [loading, setLoading] = React.useState(false);
    const [active, setActive] = React.useState(false);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        setGame(data)
    }, [data])

    const onChange = ({name, value}) => {
        setGame(g => ({...g, [name]: value}))
    }

    const update = async () => {
        setLoading(true)
        notification({
            description: 'Please wait for end',
            img: game.img_icon || '/assets/controller/save.svg',
            name: 'Updating game data',
            status: 'warning'
        }, 3000)
        if (game.source === 'gog' || game.source === 'egs') {
            electronConnector.getSteamId(({searchParams}) => {
                setSearch(searchParams)
                setActive(true)
            })
        }

        const additional = await electronConnector.getDataByGameId(game)
        setGame((g) => ({...g, ...additional}))
        if (game.source === 'gog' || game.source === 'egs') {
            window.api.removeAllListeners('getSteamId')
        }
        setLoading(false)
    }

    const getGameByFolder = async (folderId: string) => {
        setLoading(true)
        const data = await electronConnector.getGameByFolder(folderId);
        if (!data) {
            setLoading(false)
            notification({
                description: 'Folder does not have required game files',
                img: game.img_icon || '/assets/controller/save.svg',
                name: 'Game not found',
                status: 'warning'
            }, 3000);
            return;
        }
        if (getFromStorage('games').some(({id}) => id === data.id)) {
            setLoading(false)
            notification({
                description: `Game with id ${data.id} already exists`,
                img: game.img_icon || '/assets/controller/save.svg',
                name: 'Game already exists',
                status: 'warning'
            }, 3000);
            return;
        }

        if (data.source === 'gog' || data.source === 'egs') {
            electronConnector.getSteamId(({searchParams}) => {
                setSearch(searchParams)
                setActive(true)
            })
        }

        const additional = await electronConnector.getDataByGameId(data)
        setGame((g) => ({...g, ...data, ...additional}))
        if (data.source === 'gog' || data.source === 'egs') {
            window.api.removeAllListeners('getSteamId')
        }
        setLoading(false)
    }

    const render = {
        download: () => <Input label='Download link' value={game.downloadLink} onChange={onChange}
                               name='downloadLink'/>,
        howLongToBeat: () => <SearchHLTB defaultValue={game.name} update={onChange}/>,
        imageName: () => <div style={{display: 'flex', gap: 'var(--gap)'}}>
            <Input label='Game Image'
                   value={game.imageName}
                   onChange={({value, name}) => {
                       if (value) {
                           onChange({name, value: (value as string).split('/').at(-1)})
                       }
                   }}
                   type="path"
                   onlyFile={true}
                   initial={game.path}
                   name='imageName'>
            </Input>
            <button type="button" onClick={() => {
                onChange({name: 'imageName', value: ''})
            }}>Clear
            </button>
        </div>,
        images: () => <Images game={game} onChange={onChange} setGame={setGame} setLoading={setLoading}/>,
        path: () => <Input label='Path'
                           value={game.path}
                           onChange={({value, name}) => {
                               if (value) {
                                   onChange({name, value})
                                   getGameByFolder(value as string)
                               }
                           }}
                           type="path"
                           onlyFile={false}
                           name='path'/>,
        remove: () => <button tabIndex={1} type="button" onClick={remove}>Remove game</button>,
        ryujinxFields: () => <RyujinxFields game={game} onChange={onChange}/>,
        steamFields: () => <SteamFields game={game} onChange={onChange}/>,
        steamGridDB: () => <SearchGame defaultValue={game.name} update={onChange}/>,
        update: () => <button tabIndex={1} type="button" onClick={update}>Update game</button>,
        version: () => <Input label='Version' value={game.buildVersion} onChange={onChange} name='buildVersion'/>
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
                        type="button"
                        disabled={loading}
                        onClick={() => {
                            submit(game);
                            notification({
                                description: 'Games configuration updated',
                                img: '/assets/controller/save.svg',
                                name: 'Saved successfully',
                                status: 'saving'
                            })
                        }}
                >
                    submit
                </button>
            </>
        )
    }

    return (
        <div className={styles.addGameWrapper}>
            <h3>{game.name}</h3>
            <div style={{position: 'relative'}}>
                <div style={{display: 'flex', gap: 'var(--gap)', padding: 'var(--padding)'}}>
                    {render.remove()}
                    {(game.source !== 'ryujinx' && game.id) ? render.update() : null}
                    {game.name && render.howLongToBeat()}
                    {game.name && render.steamGridDB()}
                </div>
                {renderContent()}
                <SearchSteamGame defaultValue={search} active={active} setActive={setActive}/>
                <Loader loading={loading}/>
            </div>
        </div>
    )
}

export default AddGame;