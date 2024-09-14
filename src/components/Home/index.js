import {useNavigate} from "react-router-dom";
import styles from "./home.module.scss";
import {useMemo, useState} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";

const Home = () => {
    const navigate = useNavigate();
    const [background, setBackground] = useState(null);
    const games = getFromStorage('games');
    const lastPlayed = getFromStorage('lastPlayed');

    const configuredArray = () => {
        const renderSort = [];
        Object.entries(lastPlayed)
            .sort(([, ap], [, bp]) => ap < bp ? 1 : -1)
            .forEach(([key]) => {
                renderSort.push(parseInt(key))
            });
        games.forEach(({id}) => {
            if (renderSort.indexOf(id) === -1) {
                renderSort.push(id)
            }
        })

        return games.sort((a, b) => renderSort.indexOf(a.id) - renderSort.indexOf(b.id))
    }

    const sortedGames = useMemo(configuredArray, []);

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
            <ul id="game-list">
                {sortedGames.map((game, index) => (
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
                        <img src={index ? game.img_grid : game.img_landscape} alt={game.name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;