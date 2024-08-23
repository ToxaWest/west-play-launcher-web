import {Link, useNavigate} from "react-router-dom";
import styles from "./home.module.scss";
import {useEffect, useMemo, useRef} from "react";
import useAppControls from "../../hooks/useAppControls";
import {getFromStorage} from "../../helpers/getFromStorage";

const Home = () => {
    const navigate = useNavigate();
    const {init, currentIndex, setActiveIndex} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1,
            bottom: () => {
                navigate('/lastCracked')
            }
        }
    });

    const bgImage = useRef(null);

    useEffect(() => {
        init('#game-list a')
        setActiveIndex(0)
    }, []);

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

    const renderLastPlayed = (id) => {
        if (lastPlayed[id]) {
            return <div className={styles.lastPlayed}>{new Date(lastPlayed[id]).toLocaleDateString()}</div>
        }
        return null;
    }

    useEffect(() => {
        bgImage.current.style.opacity = 0;
        setTimeout(() => {
            bgImage.current.src = 0;
            if (sortedGames[currentIndex]) {
                bgImage.current.src = sortedGames[currentIndex].img_hero;
                setTimeout(() => {
                    bgImage.current.style.opacity = 1;
                }, 100)
            }
        }, 100)

    }, [currentIndex]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.image}>
                <img style={{opacity: 0}} ref={bgImage} alt={'background'}/>
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