import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
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

const router = createBrowserRouter([
    {
        element: <Root/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: '/library',
                element: <Library/>
            },
            {
                path: "/settings",
                element: <Settings/>,
            }, {
                path: "/game/:id",
                children: [
                    {
                        path: "/game/:id",
                        element: <GameContent/>
                    },
                    {
                        path: "/game/:id/achievements",
                        element: <Achievements/>
                    },
                ],
                element: <Game/>
            }
        ]
    }
]);


if (!localStorage.getItem('config')) {
    localStorage.setItem('config', JSON.stringify({settings: {}}))
}

if (!localStorage.getItem('games')) {
    localStorage.setItem('games', JSON.stringify([]))
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const logo = document.getElementById('logo')
const sound = document.createElement('audio');
sound.src = '/assets/sound/ui/swits.mp3';
sound.play()

setTimeout(() => {
    logo.remove();
    root.render(
        <Provider>
            <RouterProvider router={router}/>
        </Provider>
    );
}, 300)