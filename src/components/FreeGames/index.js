import {useEffect, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from './freeGames.module.scss';
import useAppControls from "../../hooks/useAppControls";

const FreeGames = () => {
    const [games, setGames] = useState([]);
    const {init, currentIndex} = useAppControls({
        map: {
            'left': (i) => i - 1,
            'right': (i) => i + 1,
        }
    })
    useEffect(() => {
        electronConnector.getFreeGames().then(({data: {Catalog: {searchStore: {elements}}}}) => {
            setGames(elements)
            setTimeout(() => {
                init('#freeGames li')
            }, 500)
        })
    }, []);


    const getDiscount = ({originalPrice, discount} = {}) => {
        if (discount === 0 && originalPrice === 0) {
            return 'Coming soon'
        }
        if (originalPrice === discount) {
            return 'Free now'
        }

        return 'Status unavailable'
    }

    const getImage = (keyImages, type) => {
        if (!keyImages) {
            return ''
        }
        const src = keyImages.find(t => t.type === type);
        return src?.url || ""
    }

    const renderGame = (game) => {

        return (
            <li key={game.id} tabIndex={1}>
                <img src={getImage(game.keyImages, "OfferImageTall")}/>
            </li>
        )
    }

    const currentGame = () => {
        return games[currentIndex] || {}
    }

    return (
        <div className={styles.wrapper}
             style={{backgroundImage: `url(${getImage(currentGame().keyImages, "OfferImageWide")})`}}>
            <h2>Free Games</h2>
            <ul id="freeGames">
                {games.map(renderGame)}
            </ul>
            <div className={styles.description}>
                <div className={styles.info}>
                    <span>{getDiscount(currentGame().price?.totalPrice)}</span>
                </div>
                <h2>{currentGame().title}</h2>
                <h3>{currentGame().seller?.name}</h3>
                {currentGame().description}
            </div>
        </div>
    )
}

export default FreeGames;