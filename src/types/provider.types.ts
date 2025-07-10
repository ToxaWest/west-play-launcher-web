import {Dispatch, SetStateAction} from "react";

import type {gamePadButtonName} from "./gamePad.types";

export type footerActionType = {
    button: gamePadButtonName;
    title?: string;
    onClick: () => void;
}

export type footerActionsType = {
    [key in gamePadButtonName]?: footerActionType
};

export type appControlsMap = {
    [key in gamePadButtonName]?: () => void;
}

export type notificationsType = {
    img: string,
    description?: string,
    name: string,
    status: string
}

export type AppContextType = {
    notifications?: notificationsType | null,
    footerActions: footerActionsType,
    setNotifications: Dispatch<SetStateAction<notificationsType | null>>,
    setFooterActions: Dispatch<SetStateAction<footerActionsType>>
}