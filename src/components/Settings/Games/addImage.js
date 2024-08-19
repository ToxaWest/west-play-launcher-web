import {useState} from "react";
import styles from "../settings.module.scss";
import electronConnector from "../../../helpers/electronConnector";

const AddImage = ({id, type, onChange, value}) => {
    const [images, setImages] = useState([]);
    const defaultConfig = {
        animated: false,
        limit: 48,
        order: "score_desc",
        page: 0,
        epilepsy: false,
        game_id: [parseInt(id)],
        static: true,
    }

    const imgConfig = {
        'grid': {
            body: {
                ...defaultConfig,
                asset_type: "grid",
                dimensions: ["600x900"]
            },
            path: id + '/grids/1'
        },
        'landscape': {
            body: {
                ...defaultConfig,
                asset_type: "grid",
                dimensions: ["920x430"]
            },
            path: id + '/grids/1'
        },
        'hero': {
            body: {
                ...defaultConfig,
                asset_type: "hero",
            },
            path: id + '/heroes/1'
        },
        'logo': {
            body: {
                ...defaultConfig,
                asset_type: "logo",
            },
            path: id + '/logos/1'
        },
        'icon': {
            body: {
                ...defaultConfig,
                asset_type: "icon",
            },
            path: id + '/icons/1'
        },
    }

    const select = (value) => {
        onChange({
            value,
            name: 'img_' + type
        })
        setImages([]);
    }

    const getImages = async () => {
        const data = imgConfig[type];
        const images = await electronConnector.getImage(data);
        const {data: {assets}} = images;
        setImages(assets);
    }

    return (
        <div className={styles.addImage}>
            <div className={styles.addImageField}>
                <img src={value} alt={type}/>
                <button onClick={getImages}>Select {type} image</button>
            </div>
            <ul>
                {images.map((asset) => (
                    <li key={asset.id} onClick={() => select(asset.url)}>
                        <img src={asset.thumb} alt={asset.author.name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AddImage;