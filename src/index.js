import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Root from "./components/Root";
import Settings from "./components/Settings";
import Home from "./components/Home";
import Game from "./components/Game";
import Provider from "./helpers/provider";
import Library from "./components/Library";
import GameContent from "./components/Game/content";
import Achievements from "./components/Game/achievements";
import initLocalStorage from "./helpers/initLocalStorage";
import Menu from "./components/Menu";
import smoothscroll from 'smoothscroll-polyfill';
import SettingsConfig from "./components/Settings/Config/settingsConfig";
import SettingsGames from "./components/Settings/Games/settingsGames";
import SettingsHome from "./components/Settings/Home/settingsHome";
import LastCracked from "./components/LastCracked";
import GamesMedia from "./components/Game/media";
import FreeGames from "./components/FreeGames";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
const router = createBrowserRouter([
    {
        element: <Root/>,
        children: [{
            path: "/",
            element: <Home/>
        }, {
            path: '/menu',
            element: <Menu/>
        }, {
            path: '/lastCracked',
            element: <LastCracked/>
        }, {
            path: '/freeGames',
            element: <FreeGames/>
        }, {
            path: '/library',
            element: <Library/>
        }, {
            path: "/settings",
            element: <Settings/>,
            children: [{
                path: "/settings",
                element: <SettingsHome/>
            }, {
                path: "/settings/config",
                element: <SettingsConfig/>
            }, {
                path: "/settings/games",
                element: <SettingsGames/>
            }]
        }, {
            path: "/game/:id",
            element: <Game/>,
            children: [{
                path: "/game/:id",
                element: <GameContent/>
            }, {
                path: "/game/:id/achievements",
                element: <Achievements/>
            }, {
                path: "/game/:id/media",
                element: <GamesMedia/>
            }]
        }
        ]
    }
]);

initLocalStorage();
smoothscroll.polyfill();

const root = ReactDOM.createRoot(document.getElementById('root'));
const logo = document.getElementById('logo')
const audio = new Audio('/assets/sound/ui/swits.mp3')

window.addEventListener("gamepadconnected", () => {
    audio.play()
    logo.remove();
    root.render(
        <Provider>
            <RouterProvider router={router}/>
        </Provider>
    );
})

serviceWorkerRegistration.register()