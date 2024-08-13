import {Link, useOutletContext} from "react-router-dom";
import styles from "./home.module.scss";
import {useEffect, useRef, useState} from "react";

const Home = () => {
    const ref = useRef(null);
    const selected = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const {pressedKeys, active} = useOutletContext();

    const listener = () => {
        if (pressedKeys.includes('right')) {
            if (selected.current === ref.current.length - 1) {
                selected.current = 0
            } else {
                selected.current++;
            }
            ref.current[selected.current].focus()
        }
        if (pressedKeys.includes('left')) {
            if (selected.current === 0) {
                selected.current = ref.current.length - 1;
            } else {
                selected.current--;
            }
            ref.current[selected.current].focus()
        }
    }

    useEffect(() => {
        ref.current?.[currentIndex]?.scrollIntoView({
            inline: 'center',
            behavior: 'smooth',
        })

    }, [currentIndex])

    useEffect(() => {
        if (pressedKeys.length && active && ref.current) {
            if (!document.activeElement) {
                ref.current[0].focus();
                setCurrentIndex(0)
            }
            listener()
        }
    }, [pressedKeys]);

    useEffect(() => {
        if (active) {
            ref.current = document.querySelectorAll('#game-list a')
            ref.current?.[0]?.focus();
        }
    }, [active]);

    const games = JSON.parse(localStorage.getItem('games'));

    return (
        <div className={styles.wrapper}>
            <div className={styles.image}>
                <img src={games[currentIndex]?.img_hero} alt={'background'}/>
            </div>
            <ul id="game-list" className={styles.scroll}>
                {games.map((game, index) => (
                    <li key={game.steamgriddb}>
                        <Link to={'/game/' + game.steamgriddb}
                              onFocus={() => setCurrentIndex(index)}
                        >
                            <img src={game.img_grid} alt={game.name}/>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;