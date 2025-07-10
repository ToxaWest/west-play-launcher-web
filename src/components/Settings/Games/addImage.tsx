import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import {getImageAssets, getImageInput, steamgriddbTypes} from "../../../types/electron.types";
import Loader from "../../Loader";

import styles from "../settings.module.scss";


const AddImage = ({id, type, onChange, value, game_id}: {
    type: 'grid' | 'hero' | 'logo' | 'icon',
    onChange: (e: {name: string, value: any}) => void,
    value: string,
    game_id: string,
    id: string | number,
}) => {
    const [images, setImages] = React.useState<getImageAssets[]>([]);
    const [loading, setLoading] = React.useState(false);
    const defaultConfig = {
        animated: false,
        epilepsy: false,
        game_id: [parseInt(game_id)],
        limit: 48,
        order: "score_desc",
        page: 0,
        static: true,
    }

    React.useEffect(() => {
        setLoading(false)
        setImages([]);
    }, [id])

    const imgConfig: Record<steamgriddbTypes, {body: getImageInput}> = {
        'grid': {body: {...defaultConfig, asset_type: "grid", dimensions: ["600x900"]}},
        'hero': {body: {...defaultConfig, asset_type: "hero"}},
        'icon': {body: {...defaultConfig, asset_type: "icon"}},
        'logo': {body: {...defaultConfig, asset_type: "logo"}}
    }

    const select = (url: string) => {
        electronConnector.saveImage({id, type, url}).then((r) => {
            onChange({name: 'img_' + type, value: 'file:\\' + r})
            setImages([]);
        })

    }

    const getImages = async () => {
        setLoading(true);
        const data = imgConfig[type];
        const {data: {assets}} = await electronConnector.getImage(data);
        setImages(assets);
        setLoading(false);
    }

    return (
        <div className={styles.addImage}>
            <div className={styles.addImageField}>
                <button type="button" tabIndex={1} onClick={getImages}>Select {type} image</button>
                {value ? <span>{value}</span> : null}
                {images.length ? <button type="button" tabIndex={1} onClick={() => setImages([])}>Close</button> : null}
            </div>
            <ul style={{position: 'relative'}}>
                <Loader loading={loading}/>
                {images.map((asset) => (
                    <li key={asset.id} role="button" onClick={() => select(asset.url)} tabIndex={1}>
                        <img src={asset.thumb} alt={asset.author.name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AddImage;