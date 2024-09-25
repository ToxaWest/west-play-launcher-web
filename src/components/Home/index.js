import {useNavigate} from "react-router-dom";
import styles from "./home.module.scss";
import {useState} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";

const Home = () => {
    const navigate = useNavigate();
    const [background, setBackground] = useState(null);
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

    const renderBackground = () => {
        if (background) {
            return <img src={background} alt={'background'}/>
        }
        return null
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.image}>
                {renderBackground()}
            </div>
            <ul>
                {configuredArray().map((game) => (
                    <li key={game.id}
                        tabIndex={1}
                        id={game.id}
                        onFocus={() => {
                            setBackground(game.img_hero)
                        }}
                        onClick={() => {
                            window.__back = {id: game.id, url: '/'}
                            navigate('/game/' + game.id)
                        }}>
                        <img src={game.img_grid} alt={game.name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;