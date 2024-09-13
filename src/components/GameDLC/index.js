import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import styles from './GameDLC.module.scss';
import Modal from "../Modal";
import {useState} from "react";

const GameDLC = () => {
    const {id} = useParams();
    const {dlcList} = getFromStorage('games').find(({id: gid}) => gid.toString() === id);

    const [activeId, setActiveId] = useState(null);

    const renderItem = (item) => {
        return (
            <li key={item.id} tabIndex={1} onClick={() => {
                setActiveId(item.id)
            }}>
                <img src={item.header_image} alt={item.name}/>
                {(activeId === item.id) && <Modal onClose={() => setActiveId(null)}>
                    <div className={styles.modal}>
                        <div className={styles.image}>
                            <img src={item.header_image} alt={item.name}/>
                        </div>
                        <div className={styles.modal_content} id={'scroll'}>
                            <h4>{item.name}</h4>
                            <span dangerouslySetInnerHTML={{__html: item.short_description}}/>
                        </div>
                    </div>
                </Modal>}
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