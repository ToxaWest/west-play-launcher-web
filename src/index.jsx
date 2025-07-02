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
import SettingsGames from "./components/Settings/Games/settingsGames";
import SettingsHome from "./components/Settings/Home/settingsHome";
import GamesMedia from "./components/Game/media";
import GameDLC from "./components/GameDLC";
import News from "./components/Game/news";
import SettingsImportEGS from "./components/Settings/import/settingsImportEGS";
import SettingsImportSteam from "./components/Settings/import/settingsImportSteam";
import SettingsImportNintendo from "./components/Settings/import/settingsImportNintendo";
import Media from "./components/Media";

const router = createBrowserRouter([
    {
        element: <Root/>,
        children: [{
            path: "/",
            element: <Home/>
        },{
            path: '/media',
            element: <Media/>
        }, {
            path: '/menu',
            element: <Menu/>
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
                path: "/settings/games",
                element: <SettingsGames/>
            }, {
                path: "/settings/import-egs",
                element: <SettingsImportEGS/>
            }, {
                path: "/settings/import-nintendo",
                element: <SettingsImportNintendo/>
            }, {
                path: "/settings/import-steam",
                element: <SettingsImportSteam/>
            }]
        }, {
            path: "/game/:id",
            element: <Game/>,
            children: [{
                path: "/game/:id",
                element: <GameContent/>
            },{
                path: "/game/:id/news",
                element: <News/>
            },{
                path: "/game/:id/dlc",
                element: <GameDLC/>
            }, {
                path: "/game/:id/achievements",
                element: <Achievements/>
            }, {
                path: "/game/:id/media",
                element: <GamesMedia/>
            }]
        }]
    }
]);

initLocalStorage();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider>
        <RouterProvider router={router}/>
    </Provider>
);