import {useNavigate} from "react-router-dom";
import styles from "./home.module.scss";
import {useEffect, useMemo, useState} from "react";
import {getFromStorage} from "../../helpers/getFromStorage";
import usePrevPath from "../../hooks/usePrevPath";
import useAppControls from "../../hooks/useAppControls";

const Home = () => {
    const navigate = useNavigate();
    const {setPrevPath, prevPath} = usePrevPath()
    const {init} = useAppControls()
    const [background, setBackground] = useState(null);
    const games = getFromStorage('games');
    const lastPlayed = getFromStorage('lastPlayed');

    useEffect(() => {
        init('#game-list li', prevPath?.index || 0)
        setPrevPath(null)
    }, []);

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
                        onFocus={() => {
                            setBackground(game.img_hero)
                        }}
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
            </ul>
        </div>
    )
}

export default Home;