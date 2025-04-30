import styles from './library.module.scss';
import {useNavigate} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";

const Library = () => {
    const games = getFromStorage('games');
    const gamesInRow = getFromStorage('config').settings.gamesInRow || 6;
    const navigation = useNavigate();

    const sort = (a, b) => a.name.localeCompare(b.name);

    return (
        <div className={styles.wrapper} style={{'--games-in-row': gamesInRow}}>
            <ul className={styles.list} id="library-list">
                {games.sort(sort).map((game) => (
                    <li key={game.id} id={game.id} tabIndex={1} onClick={() => {
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