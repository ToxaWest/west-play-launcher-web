import React from "react";
import type {Game} from "@type/game.types";
import type {widgetWrapperStyleInterface} from "@type/widget.types";
import {useNavigate} from "react-router-dom";

import {getFromStorage} from "../../helpers/getFromStorage";

import styles from "./widgets.module.scss"

const PlayedWidget = ({setGame}) => {
    const navigate = useNavigate();
    const games = getFromStorage('games');
    const lastPlayed = getFromStorage('lastPlayed');
    const configuredArray = () => {
        const res = Object.entries(lastPlayed)
            .sort(([, ap], [, bp]) => ap < bp ? 1 : -1)
            .reduce((acc, [curr]) => {
                const game = games.find(({id}) => id == curr);
                return game ? [...acc, game] : acc
            }, [])
        if (res.length > 8) {
            res.length = 8;
        }
        return [...res, {
            id: 'library',
            img_grid: '/assets/library-icon-1181955-512.png',
            img_icon: '/assets/library-icon-1181955-512.png',
            name: 'Library',
            short_description: 'Installed games library',
            title: 'Library'
        }];
    }

    const renderGame = (game: Game) => {
        return (
            <li key={game.id}
                tabIndex={1}
                role="button"
                id={game.id.toString()}
                onClick={() => {
                    if (game.id === 'library') {
                        navigate('/' + game.id)
                        return;
                    }
                    window.__back = {id: game.id, url: '/'}
                    navigate('/game/' + game.id)
                }}
                onFocus={() => {
                    setGame(game)
                }}>
                <img src={game.img_icon} alt={game.title} loading={"lazy"}/>
            </li>
        )
    }

    const style: widgetWrapperStyleInterface = {
        '--lines': '1'
    }

    return (
        <ul className={styles.lastPlayed} style={style}>
            {configuredArray().map(renderGame)}
        </ul>
    )

}

export default PlayedWidget;