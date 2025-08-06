import React from "react";
import useFooterActions from "@hook/useFooterActions";
import {Game} from "@type/game.types";
import {useNavigate} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";
import i18n from "../../helpers/translate";

import styles from './library.module.scss';

interface StyleInterface extends React.CSSProperties {
    '--games-in-row': number
}

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

    const style: StyleInterface = {'--games-in-row': gamesInRow}

    const renderItem = (game: Game) => React.createElement('li', {
        id: game.id.toString(),
        key: game.id,
        onClick: () => {
            window.__back = {id: game.id, url: '/library'}
            navigation('/game/' + game.id)
        },
        role: "button",
        tabIndex: 1

    }, React.createElement('img', {
        alt: game.name,
        src: game.img_grid
    }))

    const renderNavigation = () => {
        if (!games.some(a => a.archive)) return null
        return React.createElement('div', {
            className: styles.navigation,
            key: "navigation",
        }, [
            React.createElement('img', {
                key: "left",
                onClick: changeTab,
                src: '/assets/controller/left-bumper.svg',
                tabIndex: 0
            }),
            React.createElement('span', {
                className: state === 'library-list' ? styles.navActive : '',
                key: 'games-button',
                onClick: changeTab,
                tabIndex: 0
            }, i18n.t('Games')),
            React.createElement('span', {
                className: state != 'library-list' ? styles.navActive : '',
                key: 'archive-button',
                onClick: changeTab,
                tabIndex: 0
            }, i18n.t('Archive')),
            React.createElement('img', {
                key: "right",
                onClick: changeTab,
                src: '/assets/controller/right-bumper.svg',
                tabIndex: 0
            })

        ])
    }

    return React.createElement('div', {
        className: styles.wrapper,
        style: style,
    }, [renderNavigation(), React.createElement('ul', {
        className: styles.list,
        id: "library-list",
        key: "library-list"
    }, games.filter(g => {
        if (state === 'library-list') return !g.archive
        else return g.archive
    }).sort(sort).map(renderItem))])
}

export default Library