import React from "react";
import {Outlet, useParams} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";

import GameActions from "./actions";

const Game = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    if (!game) return null;

    return (
        <div className="text-[18px] bg-theme-transparent min-h-screen pb-[50px] mb-[-50px]">
            <div className="relative h-[32.3vw] mb-[calc(-61px-7vw)]">
                <div className="w-[35vw] absolute z-[2] h-full left-0 top-0 flex items-center justify-center pt-[2vw] pr-[5vw] pb-[calc(6vw+61px)] pl-[5vw]">
                    <img src={game.img_logo} alt={'logo'} className="block max-w-full max-h-full"/>
                </div>
                <img src={game.img_hero} className="max-w-full w-screen [mask-image:linear-gradient(black,black_75%,transparent)]" alt={game.name}/>
            </div>
            <GameActions game={game}/>
            <Outlet/>
        </div>
    )
}

export default Game;