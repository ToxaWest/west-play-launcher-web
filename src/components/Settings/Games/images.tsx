import React, {Dispatch, SetStateAction} from "react";
import useNotification from "@hook/useNotification";
import type {Game} from "@type/game.types";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";

import AddImage from "./addImage";

const Images = ({game, onChange, setLoading, setGame}: {
    game: Game
    onChange: (e: { name: string, value: any }) => void,
    setLoading: (loading: boolean) => void,
    setGame: Dispatch<SetStateAction<Game>>,
}) => {
    const notification = useNotification();

    const renderSteamAssets = () => {
        const {id, steamgriddb} = game;
        if (steamgriddb) {
            return <button tabIndex={1} type="button" onClick={() => {
                setLoading(true);
                notification({
                    description: i18n.t('Please wait for end'),
                    img: game.img_icon || '/assets/controller/save.svg',
                    name: i18n.t('Getting images from steam'),
                    status: 'warning'
                }, 3000)
                electronConnector.getSteamAssets({id, steamgriddb}).then(data => {
                    setGame(g => ({...g, ...data}))
                    setLoading(false);
                    notification({
                        description: i18n.t('Do not forgot save changes'),
                        img: game.img_icon || '/assets/controller/save.svg',
                        name: i18n.t('Images updated'),
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