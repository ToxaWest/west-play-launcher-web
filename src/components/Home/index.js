import {Link} from "react-router-dom";
import styles from "./home.module.scss";
import {useEffect} from "react";
import useAppControls from "../../hooks/useAppControls";

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

    const games = JSON.parse(localStorage.getItem('games'));

    return (
        <div className={styles.wrapper}>
            <div className={styles.image}>
                {games[currentIndex]?.img_hero && <img src={games[currentIndex]?.img_hero} alt={'background'}/>}
            </div>
            <ul id="game-list">
                {games.map((game) => (
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

export default Home;