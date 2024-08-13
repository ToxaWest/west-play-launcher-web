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
                <img src={games[currentIndex]?.img_hero} alt={'background'}/>
            </div>
            <ul id="game-list" className={styles.scroll}>
                {games.map((game) => (
                    <li key={game.steamgriddb}>
                        <Link to={'/game/' + game.steamgriddb}>
                            <img src={game.img_grid} alt={game.name}/>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;