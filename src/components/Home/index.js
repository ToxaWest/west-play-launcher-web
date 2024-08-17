import {Link} from "react-router-dom";
import styles from "./home.module.scss";
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";
import {getFromStorage} from "../../helpers/getFromStorage";

const Home = () => {
    const {init, currentIndex} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1
        },
        animation: (e) => {
            e.scrollIntoView({
                inline: 'center',
                behavior: 'smooth',
            })
        }
    });

    useEffect(() => {
        init({
            selector: '#game-list a'
        })
    }, []);

    const games = getFromStorage('games');
    const lastPlayed = getFromStorage('lastPlayed');

    const configuredArray = () => {
        const renderSort = [];
        Object.entries(lastPlayed)
            .sort(([, ap], [, bp]) => ap < bp ? 1 : -1)
            .forEach(([key]) => {
                renderSort.push(key)
            });
        games.forEach(({id}) => {
            if (renderSort.indexOf(id) === -1) {
                renderSort.push(id)
            }
        })

        return games.sort((a, b) => renderSort.indexOf(a.id) - renderSort.indexOf(b.id))
    }

    const sortedGames = configuredArray();

    const renderLastPlayed = (id) => {
        if(lastPlayed[id]){
            return <div className={styles.lastPlayed}>{new Date(lastPlayed[id]).toLocaleDateString()}</div>
        }
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.image}>
                {games[currentIndex]?.img_hero && <img src={sortedGames[currentIndex]?.img_hero} alt={'background'}/>}
            </div>
            <ul id="game-list">
                {sortedGames.map((game, index) => (
                    <li key={game.id}>
                        <Link to={'/game/' + game.id}>
                            <img src={index ? game.img_grid : game.img_landscape} alt={game.name}/>
                            {renderLastPlayed(game.id)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;