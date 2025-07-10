import React from "react";

import type {Game} from "../../types/game.types";

import RenderHLTB from "./renderHLTB";

import styles from "./game.module.scss";

// eslint-disable-next-line @eslint-react/no-unstable-default-props
const RenderContent = ({game, fields = []}: { game: Game, fields?: { label: string, value: any }[] }) => {

    const renderDevelopers = (devs: string[]) => {
        if (!devs) {
            return null
        }
        return devs.filter((dev) => dev).join(', ');
    }

    const infoData = [...fields, {
        label: 'Metacritic',
        value: game.metacritic?.score
    }, {
        label: 'Release date',
        value: game.release_date?.date
    }, {
        label: 'Players',
        value: game.players
    }, {
        label: 'PEGI rating',
        value: game.required_age
    }, {
        label: 'Developers',
        value: renderDevelopers(game.developers)
    }]

    const renderAboutContent = (content: string) => {
        if (!content) return null;
        const contentParser = () => {
            if (game.source === 'egs') {
                return content.replaceAll(/!\[(.*?)] \((.*?)\)/gm, `<img src="$2" alt="$1" onerror="this.style.display='none'"/>`)
            }
            return content
        }

        return <div dangerouslySetInnerHTML={{__html: contentParser()}}/>
    }

    return (
        <div className={styles.content}>
            <div className={styles.description}>
                <h1>{game.name}</h1>
                {game.short_description && <div dangerouslySetInnerHTML={{__html: game.short_description}}/>}
                {renderAboutContent(game.about_the_game)}
            </div>
            <div className={styles.info}>
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
                         onError={e => (e.target as HTMLImageElement).style.display = 'none'}
                         alt={game.name}/>
                }
                <RenderHLTB game={game}/>
            </div>
        </div>
    )
}

export default RenderContent