import styles from './library.module.scss';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import usePrevPath from "../../hooks/usePrevPath";
import GamePadNavigation from "../../helpers/gamePadNavigation";

const Library = () => {
    const {setPrevPath, prevPath} = usePrevPath()
    const games = getFromStorage('games');
    const gamesInRow = getFromStorage('config').settings.gamesInRow || 6;
    const navigation = useNavigate();

    useEffect(() => {
        setPrevPath(null)
    }, []);

    const sort = (a, b) => a.name.localeCompare(b.name);

    return (
        <div className={styles.wrapper} style={{'--games-in-row': gamesInRow}}>
            <ul className={styles.list} id="library-list">
                <GamePadNavigation defaultIndex={prevPath?.index || 0}>
                    {games.sort(sort).map((game, index) => (
                        <li key={game.id} tabIndex={1} onClick={() => {
                            setPrevPath({
                                index,
                                url: '/library'
                            })
                            navigation('/game/' + game.id)
                        }}>
                            <img src={game.img_grid} alt={game.name}/>
                        </li>
                    ))}
                </GamePadNavigation>
            </ul>
        </div>
    )

}

export default Library