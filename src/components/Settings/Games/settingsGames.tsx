import React from "react";
import {Game} from "@type/game.types";

import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage, setToStorage} from "../../../helpers/getFromStorage";
import i18n from "../../../helpers/translate";

import AddGame from "./addGame";

const Section = ({title, children, action}: {title: string, children: React.ReactNode, action?: React.ReactNode}) => (
    <div className="flex flex-col gap-2 mb-gap">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold opacity-70">{title}</h2>
            {action}
        </div>
        <div className="glass p-theme rounded-theme flex flex-col gap-2">
            {children}
        </div>
    </div>
)

const SettingsGames = () => {
    const initialGames = getFromStorage('games');
    const [games, setGames] = React.useState(initialGames)
    const [activeIndex, setActiveIndex] = React.useState<number>(null);

    const renderForm = () => {
        if (typeof activeIndex !== 'number') return null

        return (
            <div className="mt-4 pt-4 border-t border-white/10">
                <AddGame
                    data={games[activeIndex]}
                    remove={() => {
                        setGames(g => {
                            const newGames = [...g];
                            newGames.splice(activeIndex, 1)
                            return newGames;
                        })
                        setActiveIndex(null)
                        setToStorage('games', games)
                        window.location.reload()
                    }}
                    submit={(d: Game) => {
                        if (d.source === 'steam' && d.unofficial && d.img_icon) {
                            electronConnector.setAppModel({
                                icon: d.img_icon.replace('file:\\', ''),
                                id: d.id,
                                name: d.name
                            })
                        }
                        setGames(g => {
                            const newGames = [...g];
                            newGames[activeIndex] = d
                            return newGames
                        })
                        setActiveIndex(null)
                        setToStorage('games', games)
                        window.location.reload()
                    }}
                />
            </div>
        )
    }

    const addGameButton = (
        <button tabIndex={1} type="button" className="m-0 py-1 px-4 text-xs font-bold" onClick={() => {
            setGames((d) => {
                return [{
                    dlc: [],
                    dlcList: [],
                    exeArgs: {},
                    exePath: '',
                    id: 'tempGameId',
                    img_grid: '',
                    img_hero: '',
                    img_icon: '',
                    img_logo: '',
                    movies: [],
                    name: '',
                    path: '',
                    screenshots: [],
                    source: null,
                    title: '',
                    unofficial: null
                }, ...d]
            })
            setActiveIndex(0)
        }}>{i18n.t('Add Game')}
        </button>
    );

    return (
        <div className="pb-10">
            <h1 className="text-2xl font-bold mb-gap px-2">{i18n.t('Library Management')}</h1>
            
            <Section title={i18n.t('Installed Games')} action={addGameButton}>
                <ul className="grid grid-cols-4 gap-2 w-full list-none p-0 m-0">
                    {games.map((game, index) => (
                        <li 
                            key={game.id} 
                            role="button" 
                            tabIndex={1}
                            onClick={() => {
                                setActiveIndex((i) => (i === index ? null : index))
                            }} 
                            className={`flex items-center gap-2 p-1.5 border rounded-theme transition-all cursor-pointer overflow-hidden focus-bloom ${
                                activeIndex === index 
                                    ? 'bg-text text-theme border-text' 
                                    : 'bg-theme/20 border-theme-transparent text-text-secondary hover:border-text-secondary hover:text-text'
                            }`}
                        >
                            {game.img_icon && (
                                <img 
                                    src={game.img_icon} 
                                    alt="" 
                                    className="h-8 w-8 rounded-sm shrink-0 object-contain bg-black/5"
                                />
                            )}
                            <span className="text-[13px] font-semibold truncate leading-tight">
                                {game.name || i18n.t('New Game')}
                            </span>
                        </li>
                    ))}
                </ul>
                {renderForm()}
            </Section>
        </div>
    )
}

export default SettingsGames;