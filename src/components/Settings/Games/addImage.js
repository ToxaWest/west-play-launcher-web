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
            }
        },
        'hero': {
            body: {
                ...defaultConfig,
                asset_type: "hero",
            }
        },
        'logo': {
            body: {
                ...defaultConfig,
                asset_type: "logo",
            }
        },
        'icon': {
            body: {
                ...defaultConfig,
                asset_type: "icon",
            }
        },
    }

    const select = (url) => {
        electronConnector.saveImage({url, type, id}).then((r) => {
            onChange({
                value: 'file:\\' + r,
                name: 'img_' + type
            })
            setImages([]);
        })

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
                <button tabIndex={1} onClick={getImages}>Select {type} image</button>
                {value ? <span>{value}</span> : null}
            </div>
            <ul>
                {images.map((asset) => (
                    <li key={asset.id} onClick={() => select(asset.url)} tabIndex={1}>
                        <img src={asset.thumb} alt={asset.author.name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AddImage;