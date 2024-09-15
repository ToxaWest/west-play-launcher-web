import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import CrackWatchList from "../CrackWatchList";

const LastCracked = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        electronConnector.crackWatchRequest().then((g) => {
            setGames(g.games);
        })
    }, [])

    return <CrackWatchList games={games} title={'Cracked Games'}/>
}

export default LastCracked