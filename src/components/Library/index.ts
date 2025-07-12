import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {Game} from "@type/game.types";
import {useNavigate} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";

import styles from './library.module.scss';

interface StyleInterface extends React.CSSProperties {
    '--games-in-row': number
}

const Library = () => {
    const games = getFromStorage('games');
    const gamesInRow = getFromStorage('config').settings.gamesInRow;
    const navigation = useNavigate();
    const {setFooterActions} = useFooterActions()
    React.useEffect(() => {
        setFooterActions({})
    }, [])
    const sort = (a: Game, b: Game) => a.name.localeCompare(b.name);

    const style: StyleInterface = {'--games-in-row': gamesInRow}

    const renderItem = (game: Game) => React.createElement('li', {
        id: game.id.toString(),
        key: game.id,
        onClick: () => {
            window.__back = {id: game.id, url: '/library'}
            navigation('/game/' + game.id)
        },
        role: "button",
        tabIndex: 1

    }, React.createElement('img', {
        alt: game.name,
        src: game.img_grid
    }))

    return React.createElement('div', {
        className: styles.wrapper,
        style: style,
    }, React.createElement('ul', {
        className: styles.list,
        id: "library-list"
    }, games.sort(sort).map(renderItem)))
}

export default Library