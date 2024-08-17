import styles from './library.module.scss';
import {Link} from "react-router-dom";
import useAppControls from "../../hooks/useAppControls";
import {useEffect} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";

const Library = () => {
    const games = getFromStorage('games');
    const gamesInRow = getFromStorage('config').settings.gamesInRow || 6;

    const {init} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1,
            'top' : (i) => {
                return i - gamesInRow
            },
            bottom: (i) => {
                const res = i + gamesInRow;
                if(res > games.length) {
                    return 0
                }
                return res
            }
        },
        animation: (e) => {
            e.scrollIntoView({
                block: 'center',
                behavior: 'smooth',
            })
        }
    });

    useEffect(() => {
        init({
            selector: '#library-list a'
        })
    }, []);

    const sort = (a, b) => a.name.localeCompare(b.name);

    return (
        <div className={styles.wrapper} style={{'--games-in-row': gamesInRow}}>
            <ul className={styles.list} id="library-list">
                {games.sort(sort).map((game) => (
                    <li key={game.id}>
                        <Link to={'/game/' + game.id}>
                            <img src={game.img_grid} alt={game.name}/>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )

}

export default Library