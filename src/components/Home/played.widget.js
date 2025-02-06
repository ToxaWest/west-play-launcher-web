import {useNavigate} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import styles from "./widgets.module.scss";

const PlayedWidget = ({setGame}) => {
    const navigate = useNavigate();
    const games = getFromStorage('games');
    const lastPlayed = getFromStorage('lastPlayed');
    const configuredArray = () => {
        return Object.entries(lastPlayed)
            .sort(([, ap], [, bp]) => ap < bp ? 1 : -1)
            .reduce((acc, [curr]) => {
                const game = games.find(({id}) => id === parseInt(curr));
                return game ? [...acc, game] : acc
            }, [])
    }

    const renderGame = (game) => {
        return (
            <li key={game.id}
                tabIndex={1}
                id={game.id}
                onClick={() => {
                    window.__back = {id: game.id, url: '/'}
                    navigate('/game/' + game.id)
                }}
                onFocus={() => {
                    setGame(game)
                }}>
                <img src={game.img_icon} alt={game.title} loading={"lazy"}/>
            </li>
        )
    }

    return (
        <ul className={styles.lastPlayed}>
            {configuredArray().map(renderGame)}
        </ul>
    )

}

export default PlayedWidget;