import type {gamePadButtonName} from "@type/gamePad.types";

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
    gamepad: number | null = null;
    activeWrapper = ':root';
    stickPress = {};

    constructor(gamepad: Gamepad) {
        this.gamepad = gamepad.index;
    }

    sendEvent = (button: gamePadButtonName) => {
        document.documentElement.style.cursor = "none";
        if (!this.visible) return;
        if (sound[button]) {
            const audio = new Audio('/assets/sound/ui/' + sound[button] + '.mp3');
            audio.play().catch(() => {/* Ignore autoplay restrictions */});
        }
        
        try {
            navigator.getGamepads()[this.gamepad]?.vibrationActuator?.playEffect("dual-rumble", {
                duration: 100, startDelay: 0, strongMagnitude: 0, weakMagnitude: 0.4
            }).catch(() => {/* Ignore vibration errors */});
        } catch {
            // Vibration not supported
        }

        document.dispatchEvent(new CustomEvent('gamePadClick', {
            detail: {button, gamePadId: this.gamepad, id: keyMapping.indexOf(button)}
        }));
    }

    getStickValue = (value: number, test: (v: number) => boolean) =>
        (test(value) && Math.abs(value) > 0.4) ? new Date().getTime() : 0

    init = (prevPressed = {}) => {
        if (typeof this.gamepad !== "number" || !navigator.getGamepads()[this.gamepad]) return
        
        const pad = navigator.getGamepads()[this.gamepad];
        const {axes: [horizontal, vertical, horizontalR, verticalR], buttons} = pad;
        
        const pressed = buttons.reduce((acc, button, index) => {
            acc[index] = button.pressed;
            return acc;
        }, {})

        const stickPress = {
            17: this.getStickValue(vertical, value => value < 0), // top
            18: this.getStickValue(vertical, value => value > 0), // bottom
            19: this.getStickValue(horizontal, value => value < 0), // left
            20: this.getStickValue(horizontal, value => value > 0), // right
            21: this.getStickValue(horizontalR, value => value < 0),
            22: this.getStickValue(horizontalR, value => value > 0)
        }

        Object.entries(stickPress).forEach(([key, value]) => {
            if (value) {
                if (!this.stickPress[key]) {
                    this.sendEvent(keyMapping[key])
                    this.stickPress[key] = value;
                } else {
                    const elapsed = (value as number) - (this.stickPress[key] as number);
                    // Initial delay 400ms, then repeat every 150ms
                    if (elapsed >= 400 || (elapsed >= 150 && this.stickPress[key + '_repeat'])) {
                        this.sendEvent(keyMapping[key]);
                        this.stickPress[key] = value;
                        this.stickPress[key + '_repeat'] = true;
                    }
                }
            } else {
                this.stickPress[key] = value;
                this.stickPress[key + '_repeat'] = false;
            }
        })

        Object.entries(pressed).forEach(([key, value]) => {
            if (value && !prevPressed[key]) this.sendEvent(keyMapping[key])
        })

        if (Math.abs(verticalR) > 0.3) {
            const wrapper = document.querySelector(this.activeWrapper);
            if (wrapper) wrapper.scrollTop += verticalR * scrollBooster;
        }

        window.requestAnimationFrame(() => this.init(pressed))
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