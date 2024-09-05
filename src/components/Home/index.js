import {useNavigate} from "react-router-dom";
import styles from "./home.module.scss";
import {useEffect, useMemo, useState} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import usePrevPath from "../../hooks/usePrevPath";
import GamePadNavigation from "../../helpers/gamePadNavigation";

const Home = () => {
    const navigate = useNavigate();
    const {setPrevPath, prevPath} = usePrevPath()
    const [currentIndex, setCurrentIndex] = useState(prevPath?.index || 0);
    useEffect(() => {
        setPrevPath(null)
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

    const renderBackground = () => {
        if (sortedGames[currentIndex]) {
            return <img src={sortedGames[currentIndex].img_hero} alt={'background'}/>
        }
        return null
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.image}>
                {renderBackground()}
            </div>
            <ul id="game-list">
                <GamePadNavigation defaultIndex={prevPath?.index || 0} focusedIndex={setCurrentIndex}>
                    {sortedGames.map((game, index) => (
                        <li key={game.id}
                            tabIndex={1}
                            onClick={() => {
                                setPrevPath({
                                    url: '/',
                                    index
                                })
                                navigate('/game/' + game.id)
                            }}>
                            <img src={index ? game.img_grid : game.img_landscape} alt={game.name}/>
                        </li>
                    ))}
                </GamePadNavigation>
            </ul>
        </div>
    )
}

export default Home;