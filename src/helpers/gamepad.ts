import type {gamePadButtonName} from "../types/gamePad.types";

import electronConnector from "./electronConnector";
import {modalIsActive} from "./modalIsActive";

const keyMapping: gamePadButtonName[] = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'options', 'select', 'l3', 'r3', 'top', 'bottom', 'left', 'right', 'home', 'top', 'bottom', 'left', 'right', 'leftScrollY', 'rightScrollY']

const sound: { [key in gamePadButtonName]?: string } = {
    'a': 'select',
    'b': 'back',
    'bottom': 'move',
    'left': 'move',
    'right': 'move',
    'select': 'switchup',
    'top': 'move',
    'x': 'back',
    'y': 'select'
}

const scrollBooster = 15;

class GamepadApi {
    visible = true;
    gamepad;
    activeWrapper = ':root';
    stickPress = {};

    constructor(gamepad: Gamepad) {
        this.gamepad = gamepad.index;
    }

    sendEvent = (button: gamePadButtonName) => {
        document.documentElement.style.cursor = "none";
        document.documentElement.style.pointerEvents = "none";
        if (!this.visible) return;
        if (sound[button]) new Audio('/assets/sound/ui/' + sound[button] + '.mp3').play();
        document.dispatchEvent(new CustomEvent('gamePadClick', {
            detail: {
                button,
                gamePadId: this.gamepad,
                id: keyMapping.indexOf(button)
            }
        }));
    }

    getStickValue = (value: number, test: (v: number) => boolean) =>
        (test(value) && Math.abs(value) > 0.4) ? new Date().getTime() : 0

    init = (prevPressed = {}) => {
        if (typeof this.gamepad !== "number") return
        const {axes: [horizontal, vertical, horizontalR, verticalR], buttons} = navigator.getGamepads()[this.gamepad];
        const pressed = buttons.reduce((acc, button, index) => {
            acc[index] = button.pressed;
            return acc;
        }, {})
        const stickPress = {
            17: this.getStickValue(vertical, value => value < 0),
            18: this.getStickValue(vertical, value => value > 0),
            19: this.getStickValue(horizontal, value => value < 0),
            20: this.getStickValue(horizontal, value => value > 0),
            21: this.getStickValue(horizontalR, value => value < 0),
            22: this.getStickValue(horizontalR, value => value > 0)
        }

        Object.entries(stickPress).forEach(([key, value]) => {
            if (value) {
                if (!this.stickPress[key]) {
                    this.sendEvent(keyMapping[key])
                    this.stickPress[key] = value;
                } else if (value - this.stickPress[key] >= 250) {
                    this.sendEvent(keyMapping[key])
                    this.stickPress[key] = value;
                }
            } else this.stickPress[key] = value;
        })

        Object.entries(pressed).forEach(([key, value]) => {
            if (!value && prevPressed[key] === true) this.sendEvent(keyMapping[key])
        })
        if (Math.abs(verticalR) > 0.3) document.querySelector(this.activeWrapper).scrollTop += verticalR * scrollBooster;
        setTimeout(() => window.requestAnimationFrame(() => this.init(pressed)))
    }

    connect = () => {
        electronConnector.onVisibilityChange(visible => this.visible = visible);
        modalIsActive((active) => {
            this.activeWrapper = active ? '#modal #scroll' : ':root'
        })
        this.init()
    }

    disconnect = () => {
        this.gamepad = null;
    }

}

export default GamepadApi;