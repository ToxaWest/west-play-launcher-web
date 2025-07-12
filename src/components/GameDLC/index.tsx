import {useState} from "react";
import React from "react";
import type {DlcType} from "@type/game.types";
import {useParams} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import Modal from "../Modal";

import styles from './GameDLC.module.scss';

const GameDLC = () => {
    const {id} = useParams();
    const {dlcList} = getFromStorage('games').find(({id: gid}) => gid.toString() === id);

    const [activeId, setActiveId] = useState<string>(null);

    const renderImage = (item: DlcType) => React.createElement(
        'img', {
            alt: item.name,
            onError: e => {
                if ((e.target as HTMLImageElement).src !== (item.header_image)) return;
                electronConnector.imageProxy((e.target as HTMLImageElement).src).then(bytes => {
                    (e.target as HTMLImageElement).src = URL.createObjectURL(new Blob(bytes))
                })
            },
            src: item.header_image
        })

    const renderItem = (item: DlcType) => {
        return (
            <li key={item.id} tabIndex={1} role="button" onClick={() => {
                setActiveId(item.id)
            }}>
                {renderImage(item)}
                {(activeId === item.id) && (
                    <Modal onClose={() => setActiveId(null)}>
                        <div className={styles.modal}>
                            <div className={styles.image}>{renderImage(item)}</div>
                            <div className={styles.modal_content} id={'scroll'}>
                                <h4>{item.name}</h4>
                                <span dangerouslySetInnerHTML={{__html: item.short_description}}/>
                            </div>
                        </div>
                    </Modal>
                )}
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