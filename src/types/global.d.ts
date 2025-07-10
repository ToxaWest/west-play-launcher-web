/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
import type {gamePadButtonName} from "./gamePad.types";

declare global {
    interface Window {
        __back?: {
            url: string
            id: string | number
        };
        api?: {
            removeAllListeners: (chanel: string) => void;
            openLink: (url: string) => void;
        }
    }

    interface DocumentEventMap {
        gamePadClick: CustomEvent<{
            button: gamePadButtonName;
            id: number;
        }>;
    }
}
