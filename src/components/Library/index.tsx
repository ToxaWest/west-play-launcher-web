import React from "react";
import {useNavigate} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";
import useFooterActions from "../../hooks/useFooterActions";
import {Game} from "../../types/game.types";

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

    return (
        <div className={styles.wrapper} style={style}>
            <ul className={styles.list} id="library-list">
                {games.sort(sort).map((game) => (
                    <li key={game.id} id={game.id.toString()} tabIndex={1} role="button" onClick={() => {
                        window.__back = {id: game.id, url: '/library'}
                        navigation('/game/' + game.id)
                    }}>
                        <img src={game.img_grid} alt={game.name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Library