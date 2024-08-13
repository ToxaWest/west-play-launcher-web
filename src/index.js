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
import Overlay from "./components/Overlay";

const router = createBrowserRouter([
    {
        element: <Root/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/settings",
                element: <Settings/>,
            }, {
                path: "/game/:id",
                element: <Game/>
            }
        ]
    },
    {
        element: <Overlay/>,
        path: "/overlay",
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
const sound = document.getElementById('xon');
const body = document.getElementsByTagName('body')[0];


window.addEventListener("gamepadconnected", (e) => {
    sound.play().then(() => {
        setTimeout(() => {
            logo.remove();
            body.styles = {};
            root.render(
                <RouterProvider router={router}/>
            );
        }, 300)
    });
})