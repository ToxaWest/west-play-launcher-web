import React from "react";
import useNotification from "@hook/useNotification";
import type {Game} from "@type/game.types";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";
import Input from "../../Input";
import Loader from "../../Loader";

import Images from "./images";
import Rpcs3Fields from "./rpcs3Fields";
import RyujinxFields from "./ryujinxFields";
import SearchGame from "./searchGame";
import SearchHLTB from "./searchHLTB";
import SearchSteamGame from "./searchSteamGame";
import SteamFields from "./steamFields";

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
            description: i18n.t('Please wait for end'),
            img: game.img_icon || '/assets/controller/save.svg',
            name: i18n.t('Updating game data'),
            status: 'warning'
        }, 3000)
        if (game.source === 'gog' || game.source === 'egs' || game.source === 'ea') {
            electronConnector.getSteamId(({searchParams}) => {
                setSearch(searchParams)
                setActive(true)
                window.api.removeAllListeners('getSteamId')
            })
        }

        const additional = await electronConnector.getDataByGameId(game)
        setGame((g) => ({...g, ...additional}))
        setLoading(false)
    }

    const getGameByFolder = async (folderId: string) => {
        setLoading(true)
        const data = await electronConnector.getGameByFolder(folderId);
        if (!data) {
            setLoading(false)
            notification({
                description: i18n.t('Folder does not have required game files'),
                img: game.img_icon || '/assets/controller/save.svg',
                name: i18n.t('Game not found'),
                status: 'error'
            }, 3000);
            return;
        }
        if (getFromStorage('games').some(({id}) => id === data.id)) {
            setLoading(false)
            notification({
                description: i18n.t('Game with id {{id}} already exists', {id: data.id}),
                img: game.img_icon || '/assets/controller/save.svg',
                name: i18n.t('Game already exists'),
                status: 'warning'
            }, 3000);
            return;
        }

        if (data.source === 'gog' || data.source === 'egs' || data.source === 'ea') {
            electronConnector.getSteamId(({searchParams}) => {
                setSearch(searchParams)
                setActive(true)
                window.api.removeAllListeners('getSteamId')
            })
        }

        const additional = await electronConnector.getDataByGameId(data)
        setGame((g) => ({...g, ...data, ...additional}))
        setLoading(false)
    }

    const render = {
        archive: () => <button tabIndex={1} type="button" onClick={() => {
            onChange({name: 'archive', value: !game.archive})
        }}>{game.archive ? i18n.t('Remove from archive') : i18n.t('Add to archive')}</button>,
        download: () => <Input label={i18n.t('Download link')} value={game.downloadLink} onChange={onChange}
                               name='downloadLink'/>,
        howLongToBeat: () => <SearchHLTB defaultValue={game.name} update={onChange}/>,
        imageName: () => <div className="flex gap-gap">
            <Input label={i18n.t('Game Image')}
                   value={game.imageName}
                   onChange={({value, name}) => {
                       if (value) onChange({name, value: (value as string).split('/').at(-1)})
                   }}
                   type="path"
                   onlyFile={true}
                   initial={game.path}
                   name='imageName'>
            </Input>
            <button type="button" onClick={() => {
                onChange({name: 'imageName', value: ''})
            }}>
                {i18n.t('Clear')}
            </button>
        </div>,
        images: () => <Images game={game} onChange={onChange} setGame={setGame} setLoading={setLoading}/>,
        path: () => <Input label={i18n.t('Path')}
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
        remove: () => <button tabIndex={1} type="button" onClick={remove}>{i18n.t('Remove game')}</button>,
        rpcs3Fields: () => <Rpcs3Fields game={game} onChange={onChange}/>,
        ryujinxFields: () => <RyujinxFields game={game} onChange={onChange}/>,
        steamFields: () => <SteamFields game={game} onChange={onChange}/>,
        steamGridDB: () => <SearchGame defaultValue={game.name} update={onChange}/>,
        update: () => <button tabIndex={1} type="button" onClick={update}>{i18n.t('Update game')}</button>,
        updateLocalData: () => {
            if ((game.source === 'steam' || game.source === 'egs') && game.unofficial && game.path) {
                return <button tabIndex={1} type="button" onClick={() => {
                    electronConnector.getGameByFolder(game.path).then((r: Game) => {
                        setGame(g => ({...g, ...r}))
                    })
                }}>{i18n.t('Update local data')}</button>
            }
            return null
        },
        version: () => <Input label={i18n.t('Version')} value={game.buildVersion} onChange={onChange}
                              name='buildVersion'/>
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

        if (game.source === 'rpcs3') {
            return (
                <>
                    {render.rpcs3Fields()}
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
            } else return render.imageName()
        }

        if (game.source === 'egs') {
            if (game.unofficial) {
                return (
                    <>
                        {render.path()}
                        {render.imageName()}
                        {render.steamFields()}
                    </>
                )
            }
            return (
                <>
                    {render.imageName()}
                </>
            )
        }

        if (game.source === 'ea') {
            return (
                <>
                    {render.imageName()}
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
                {game.unofficial && render.download()}
                {render.images()}
                <button tabIndex={1}
                        type="button"
                        disabled={loading}
                        onClick={() => {
                            submit(game);
                            notification({
                                description: i18n.t('Games configuration updated'),
                                img: '/assets/controller/save.svg',
                                name: i18n.t('Saved successfully'),
                                status: 'saving'
                            })
                        }}
                >
                    {i18n.t('Submit')}
                </button>
            </>
        )
    }

    return (
        <div className="flex flex-col gap-gap-half [&_>_div]:flex [&_>_div]:flex-col [&_>_div]:gap-gap-half">
            <h3>{game.name}</h3>
            <div className="relative">
                <div className="flex gap-gap p-theme">
                    {render.remove()}
                    {game.id ? render.update() : null}
                    {render.updateLocalData()}
                    {game.name && render.howLongToBeat()}
                    {game.name && render.steamGridDB()}
                    {render.archive()}
                </div>
                {renderContent()}
                <SearchSteamGame defaultValue={search} active={active} setActive={setActive}/>
                <Loader loading={loading}/>
            </div>
        </div>
    )
}

export default AddGame;