import type {gamePadButtonName} from "@type/gamePad.types";
import type {Dispatch, SetStateAction} from "react";

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
    status: 'error' | 'saving' | 'success' | 'warning'
}

export type AppContextType = {
    notifications?: notificationsType | null,
    footerActions: footerActionsType,
    setNotifications: Dispatch<SetStateAction<notificationsType | null>>,
    setFooterActions: Dispatch<SetStateAction<footerActionsType>>,
    setMap: (actions: appControlsMap) => void,
    init: (selector: string) => void
}