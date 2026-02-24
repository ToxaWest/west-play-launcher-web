import React from "react";
import type {Game} from "@type/game.types";

import i18n from "../../helpers/translate";

import RenderHLTB from "./renderHLTB";

const RenderContent = ({game, fields}: { game: Game, fields?: { label: string, value: any }[] }) => {

    const renderDevelopers = (devs: string[]) => {
        if (!devs) {
            return null
        }
        return devs.filter((dev) => dev).join(', ');
    }

    const infoData = [...fields, {
        label: i18n.t('Metacritic'),
        value: game.metacritic?.score
    }, {
        label: i18n.t('Release date'),
        value: game.release_date?.date
    }, {
        label: i18n.t('Players'),
        value: game.players
    }, {
        label: i18n.t('PEGI rating'),
        value: game.required_age
    }, {
        label: i18n.t('Developers'),
        value: renderDevelopers(game.developers)
    }]

    const renderAboutContent = (content: string) => {
        if (!content) return null;
        const contentParser = () => {
            if (game.source === 'egs') {
                return content.replaceAll(/!\[(.*?)] \((.*?)\)/gm, `<img src="$2" alt="$1" onerror="this.style.display='none'"/>`)
            }
            if (game.source === 'steam') {
                return content.replaceAll(/height=(.*?)/gm, '')
            }
            return content
        }

        return <div dangerouslySetInnerHTML={{__html: contentParser()}}/>
    }

    return (
        <div className="rounded-theme w-[90vw] mx-auto my-[1vw] flex items-start gap-[1vw] relative z-2">
            <div className="bbcode flex flex-col gap-gap w-[60vw] p-gap glass rounded-theme [&_h2]:uppercase [&_h2]:m-0 [&_h2]:mb-gap-half [&_h2]:tracking-wider [&_h2]:font-bold [&_h2]:pt-[2px] [&_h1]:uppercase [&_h1]:m-0 [&_h1]:mb-gap-half [&_h1]:tracking-wider [&_h1]:font-bold [&_h1]:pt-[2px] [&_h1]:text-[20px] [&_h3]:uppercase [&_h3]:m-0 [&_h3]:mb-gap-half [&_h3]:tracking-wider [&_h3]:font-bold [&_h3]:pt-[2px] [&_h4]:uppercase [&_h4]:m-0 [&_h4]:mb-gap-half [&_h4]:tracking-wider [&_h4]:font-bold [&_h4]:pt-[2px] [&_h5]:uppercase [&_h5]:m-0 [&_h5]:mb-gap-half [&_h5]:tracking-wider [&_h5]:font-bold [&_h5]:pt-[2px] [&_h6]:uppercase [&_h6]:m-0 [&_h6]:mb-gap-half [&_h6]:tracking-wider [&_h6]:font-bold [&_h6]:pt-[2px] [&_p]:mb-gap-half [&_p]:text-text-secondary [&_img]:max-w-full [&_img]:mx-auto [&_img]:block [&_img]:min-w-[80%] [&_video]:max-w-full [&_video]:mx-auto [&_video]:block [&_video]:min-w-[80%]">
                <div className="flex items-center gap-gap-half mr-auto [&_h1]:m-0 [&_h1]:p-0 overflow-hidden max-w-full">
                    <img src={game.img_icon} alt={'icon'} className="block shrink-0 w-10 h-10 min-w-0! rounded-theme object-contain"/>
                    <h1 className="truncate">{game.name}</h1>
                </div>
                {game.short_description && <div dangerouslySetInnerHTML={{__html: game.short_description}}/>}
                {renderAboutContent(game.about_the_game)}
            </div>
            <div className="p-gap flex flex-col rounded-theme w-[30vw] text-[16px] glass [&_li]:mb-gap-half [&_li]:gap-gap-half [&_li]:flex [&_li]:items-center [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none">
                <ul>
                    {infoData.filter(({value}) => Boolean(value))
                        .map(({label, value}) => (
                            <li key={label}>
                                <strong>{label}:</strong>
                                {value}
                            </li>
                        ))}
                </ul>
                {game.img_landscape &&
                    <img src={game.img_landscape}
                         className="mb-gap-half rounded-theme"
                         onError={e => (e.target as HTMLImageElement).style.display = 'none'}
                         alt={game.name}/>
                }
                <RenderHLTB game={game}/>
            </div>
        </div>
    )
}

export default RenderContent