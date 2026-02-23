import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {Game} from "@type/game.types";
import {useNavigate} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";

const Library = () => {
    const games = getFromStorage('games');
    const gamesInRow = getFromStorage('config').settings.gamesInRow;
    const navigation = useNavigate();
    const [state, setState] = React.useState<string>('library-list');
    const {setFooterActions, removeFooterActions} = useFooterActions()

    const changeTab = () => {
        setState((s) => s === 'library-list' ? 'library-archive' : 'library-list')
    }

    React.useEffect(() => {
        setFooterActions({
            lb:  {
                button: 'lb',
                onClick: () => {
                    changeTab()
                }
            },
            rb: {
                button: 'rb',
                onClick: () => {
                    changeTab()
                }
            }
        })
        return () => {
            removeFooterActions(['lb', 'rb'])
        }
    }, [])
    const sort = (a: Game, b: Game) => a.name.localeCompare(b.name);

    const renderItem = (game: Game) => (
        <li
            id={game.id.toString()}
            key={game.id}
            onClick={() => {
                window.__back = {id: game.id, url: '/library'}
                navigation('/game/' + game.id)
            }}
            role="button"
            tabIndex={1}
            className="transition-all duration-200 ease-in-out cursor-pointer w-full min-w-0 aspect-[6/9] focus:outline-none focus:relative focus:z-[2] hover:outline-none hover:relative hover:z-[2] group focus-bloom"
        >
            <img
                alt={game.name}
                src={game.img_grid}
                className="transition-all duration-200 ease-in-out rounded-theme border-2 border-transparent block w-full object-contain group-focus:border-text-secondary group-hover:border-text-secondary"
            />
        </li>
    )

    const renderNavigation = () => {
        if (!games.some(a => a.archive)) return null
        return (
            <div className="max-w-[90vw] mx-auto my-gap flex gap-gap-half items-center justify-center">
                <button
                    type="button"
                    onClick={changeTab}
                    tabIndex={-1}
                    className="cursor-pointer m-gap bg-transparent p-0 border-none"
                >
                    <img
                        src='/assets/controller/left-bumper.svg'
                        alt="LB"
                    />
                </button>
                <button
                    type="button"
                    className={`p-theme border-b border-transparent cursor-pointer focus:outline-none bg-transparent ${state === 'library-list' ? 'border-b-text' : ''}`}
                    onClick={changeTab}
                    tabIndex={-1}
                >
                    {i18n.t('Games')}
                </button>
                <button
                    type="button"
                    className={`p-theme border-b border-transparent cursor-pointer focus:outline-none bg-transparent ${state !== 'library-list' ? 'border-b-text' : ''}`}
                    onClick={changeTab}
                    tabIndex={-1}
                >
                    {i18n.t('Archive')}
                </button>
                <button
                    type="button"
                    onClick={changeTab}
                    tabIndex={-1}
                    className="cursor-pointer m-gap bg-transparent p-0 border-none"
                >
                    <img
                        src='/assets/controller/right-bumper.svg'
                        alt="RB"
                    />
                </button>
            </div>
        )
    }

    return (
        <div className="w-[90vw] mx-auto my-gap p-gap glass rounded-theme">
            {renderNavigation()}
            <ul
                className="list-none gap-gap-half grid mt-gap"
                style={{ gridTemplateColumns: `repeat(${gamesInRow}, 1fr)` }}
            >
                {games.filter(g => {
                    if (state === 'library-list') return !g.archive
                    else return g.archive
                }).sort(sort).map(renderItem)}
            </ul>
        </div>
    )
}

export default Library