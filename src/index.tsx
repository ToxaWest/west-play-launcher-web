import './index.scss';

import React, {lazy} from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Game from "./components/Game";
import Achievements from "./components/Game/achievements";
import GameContent from "./components/Game/content";
import GamesMedia from "./components/Game/media";
import News from "./components/Game/news";
import GameDLC from "./components/GameDLC";
import Home from "./components/Home";
import Library from "./components/Library";
import Menu from "./components/Menu";
import Root from "./components/Root";
import Settings from "./components/Settings";
import SettingsGames from "./components/Settings/Games/settingsGames";
import GBEHome from "./components/Settings/GBE/gbe.home";
import SettingsHome from "./components/Settings/Home/settingsHome";
import SettingsImport from "./components/Settings/import/settingsImport";
import SettingMedia from "./components/Settings/meida/settingMedia";
import initLocalStorage from "./helpers/initLocalStorage";
import Provider from "./helpers/provider";

const Media = lazy(() => import('./components/Media'));
const MoviePageRouter = lazy(() => import("./components/Media/MoviePageRouter"));

const router = createBrowserRouter([
    {
        children: [{
            element: <Home/>,
            path: "/"
        }, {
            element: <Media/>,
            path: '/media'
        }, {
            element: <MoviePageRouter/>,
            path: '/movie'
        }, {
            element: <Menu/>,
            path: '/menu'
        }, {
            element: <Library/>,
            path: '/library'
        }, {
            children: [{
                element: <SettingsHome/>,
                path: "/settings"
            }, {
                element: <SettingsGames/>,
                path: "/settings/games"
            }, {
                element: <SettingsImport/>,
                path: "/settings/import"
            }, {
                element: <SettingMedia/>,
                path: "/settings/media"
            }, {
                element: <GBEHome/>,
                path: "/settings/gbe"
            }],
            element: <Settings/>,
            path: "/settings"
        }, {
            children: [{
                element: <GameContent/>,
                path: "/game/:id"
            }, {
                element: <News/>,
                path: "/game/:id/news"
            }, {
                element: <GameDLC/>,
                path: "/game/:id/dlc"
            }, {
                element: <Achievements/>,
                path: "/game/:id/achievements"
            }, {
                element: <GamesMedia/>,
                path: "/game/:id/media"
            }],
            element: <Game/>,
            path: "/game/:id"
        }],
        element: <Root/>
    }
]);

initLocalStorage();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider>
        <RouterProvider router={router}/>
    </Provider>
);