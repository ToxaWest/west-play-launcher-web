import React from "react";
import {getImageAssets, getImageInput, steamgriddbTypes} from "@type/electron.types";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";
import Loader from "../../Loader";

const AddImage = ({id, type, onChange, value, game_id}: {
    type: 'grid' | 'hero' | 'logo' | 'icon',
    onChange: (e: { name: string, value: any }) => void,
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

    const imgConfig: Record<steamgriddbTypes, { body: getImageInput }> = {
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
        <div className="bg-theme-transparent p-theme">
            <div className="flex items-center justify-between [&_span]:cursor-pointer hover:[&_span]:underline">
                <button type="button" tabIndex={1} onClick={getImages}>{i18n.t('Select {{type}} image', {type})}</button>
                {value ? <span tabIndex={0} role="link" onClick={() => {
                    window.open(value, '_blank')
                }}>{value}</span> : null}
                {images.length ? <button type="button" tabIndex={1} onClick={() => setImages([])}>{i18n.t('Close')}</button> : null}
            </div>
            <ul className="grid max-w-full grid-cols-5 p-2 rounded-theme gap-gap-half my-gap mx-0 list-none [&:empty]:hidden [&_img]:block [&_img]:max-w-full relative" style={{position: 'relative'}}>
                <Loader loading={loading}/>
                {images.map((asset) => (
                    <li key={asset.id} role="button" onClick={() => select(asset.url)} tabIndex={1} className="cursor-pointer">
                        <img src={asset.thumb} alt={asset.author.name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AddImage;