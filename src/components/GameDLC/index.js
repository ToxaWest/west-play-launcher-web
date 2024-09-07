import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import styles from './GameDLC.module.scss';
const GameDLC = () => {
    const {id} = useParams();
    const {dlcList} = getFromStorage('games').find(({id: gid}) => gid.toString() === id);


    const renderItem = (item) => {
        return (
            <li key={item.id}>
                <img src={item.header_image} alt={item.name} />
                <div className={styles.content}>
                    <h4>{item.name}</h4>
                    <span dangerouslySetInnerHTML={{__html: item.short_description}}/>
                </div>
            </li>
        )
    }

    return (
        <div className={styles.wrapper}>
            <ul>
                {dlcList.map(renderItem)}
            </ul>
        </div>
    )
}

export default GameDLC