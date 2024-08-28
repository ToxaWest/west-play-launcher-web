import {useNavigate} from "react-router-dom";
import styles from "./home.module.scss";
import {useEffect, useMemo, useRef} from "react";
import useAppControls from "../../hooks/useAppControls";
import {getFromStorage} from "../../helpers/getFromStorage";

const Home = () => {
    const navigate = useNavigate();
    const {init, currentIndex, setActiveIndex} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1
        }
    });

    const bgImage = useRef(null);

    useEffect(() => {
        init('#game-list li')
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

    useEffect(() => {
        bgImage.current.src = sortedGames[currentIndex].img_hero;
    }, [currentIndex]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.image}>
                <img ref={bgImage} alt={'background'}/>
            </div>
            <ul id="game-list">
                {sortedGames.map((game, index) => (
                    <li key={game.id} tabIndex={1} onClick={() => {
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