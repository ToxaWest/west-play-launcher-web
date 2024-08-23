import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import {useEffect, useState} from "react";
import styles from "./game.module.scss";

const GamesMedia = () => {
    const {id} = useParams();
    const game = getFromStorage('games').find(({id: gid}) => gid.toString() === id);
    const [current, setCurrent] = useState(0);
    const {
        movies = [],
        screenshots = []
    } = game;

    const media = [...movies, ...screenshots];

    const listener = ({detail}) => {
        const map = {
            bottom: () => {
                setCurrent((i) => {
                    if (i === (media.length - 1)) {
                        return 0
                    }
                    return i + 1
                })
            },
            top: () => {
                setCurrent((i) => {
                    if (i === 0) {
                        return [...movies, ...screenshots].length - 1
                    }
                    return i - 1
                })
            }
        }
        if (map[detail]) {
            map[detail]()
        }
    }

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        return () => {
            document.removeEventListener('gamepadbutton', listener)
        }
    }, []);

    const renderMedia = (i) => {
        const selected = media[i];
        if (selected?.webm) {
            return <video src={selected.webm.max} controls={false} muted={true} autoPlay={true} loop={true}/>;
        }

        if (selected?.path_full) {
            return <img src={selected.path_full} alt={'img'}/>
        }
        return null;
    }

    return (
        <div className={styles.media}>
            {renderMedia(current)}
        </div>
    )

}

export default GamesMedia