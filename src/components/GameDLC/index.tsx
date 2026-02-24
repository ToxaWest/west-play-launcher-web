import {useState} from "react";
import React from "react";
import type {DlcType} from "@type/game.types";
import {useParams} from "react-router-dom";

import electronConnector from "../../helpers/electronConnector";
import {getFromStorage} from "../../helpers/getFromStorage";
import Modal from "../Modal";

const GameDLC = () => {
    const {id} = useParams();
    const {dlcList} = getFromStorage('games').find(({id: gid}) => gid.toString() === id);

    const [activeId, setActiveId] = useState<string>(null);

    const renderImage = (item: DlcType, className?: string) => React.createElement(
        'img', {
            alt: item.name,
            className,
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
            <li key={item.id} tabIndex={1} role="button" className="flex items-center transition-all duration-200 ease-in-out cursor-pointer rounded-theme border-2 border-theme-transparent focus:p-0 focus:scale-112 focus:border-text-secondary hover:p-0 hover:scale-112 hover:border-text-secondary group" onClick={() => {
                setActiveId(item.id)
            }}>
                {renderImage(item, "rounded-theme block w-full")}
                {(activeId === item.id) && (
                    <Modal onClose={() => setActiveId(null)}>
                        <div className="grid grid-cols-[1fr_2fr] h-full gap-gap items-start w-full relative p-[50px_5vw] z-3 before:content-[''] before:absolute before:inset-0 before:bg-theme before:opacity-90 before:z-[-1]">
                            <div className="[&_img]:block [&_img]:rounded-theme [&_img]:w-full">{renderImage(item)}</div>
                            <div className="flex max-w-full flex-col h-full p-gap-half bg-theme-transparent overflow-y-auto gap-gap [&_img]:max-w-full" id={'scroll'}>
                                <h4 className="m-0 p-0 text-[24px]">{item.name}</h4>
                                <span className="text-[18px]" dangerouslySetInnerHTML={{__html: item.short_description}}/>
                            </div>
                        </div>
                    </Modal>
                )}
            </li>
        )
    }

    return (
        <div className="w-[90vw] mx-auto my-[1vw] flex items-start relative z-2 p-gap glass">
            <ul className="m-0 p-theme list-none grid grid-cols-4 gap-gap-half w-full">
                {dlcList.map(renderItem)}
            </ul>
        </div>
    )
}

export default GameDLC