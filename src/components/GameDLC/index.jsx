import {useParams} from "react-router-dom";
import {getFromStorage} from "../../helpers/getFromStorage";
import styles from './GameDLC.module.scss';
import Modal from "../Modal";
import {useState} from "react";
import electronConnector from "../../helpers/electronConnector";

const GameDLC = () => {
    const {id} = useParams();
    const {dlcList} = getFromStorage('games').find(({id: gid}) => gid.toString() === id);

    const [activeId, setActiveId] = useState(null);

    const renderImage = (item) => {
        return <img src={item.header_image} alt={item.name} onError={e => {
            if (e.target.src !== (item.header_image)) return;
            electronConnector.imageProxy(e.target.src).then(bytes => {
                e.target.src = URL.createObjectURL(new Blob(bytes))
            })
        }}/>
    }

    const renderItem = (item) => {
        return (
            <li key={item.id} tabIndex={1} onClick={() => {
                setActiveId(item.id)
            }}>
                {renderImage(item)}
                {(activeId === item.id) && <Modal onClose={() => setActiveId(null)}>
                    <div className={styles.modal}>
                        <div className={styles.image}>
                            {renderImage(item)}
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