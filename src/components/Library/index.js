import styles from './library.module.scss';
import {useNavigate} from "react-router-dom";
import useAppControls from "../../hooks/useAppControls";
import {useEffect} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import usePrevPath from "../../hooks/usePrevPath";

const Library = () => {
    const {setPrevPath, prevPath} = usePrevPath()
    const games = getFromStorage('games');
    const gamesInRow = getFromStorage('config').settings.gamesInRow || 6;
    const navigation = useNavigate();

    const {init} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1,
            'top': (i) => {
                return i - gamesInRow
            },
            bottom: (i) => {
                const res = i + gamesInRow;
                if (res > games.length) {
                    return 0
                }
                return res
            }
        }
    });

    useEffect(() => {
        init('#library-list li', prevPath?.index || 0);
        setPrevPath(null)
    }, []);

    const sort = (a, b) => a.name.localeCompare(b.name);

    return (
        <div className={styles.wrapper} style={{'--games-in-row': gamesInRow}}>
            <ul className={styles.list} id="library-list">
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
            </ul>
        </div>
    )

}

export default Library