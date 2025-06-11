import electronConnector from "./electronConnector";
import {modalIsActive} from "./modalIsActive";

const keyMapping = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'options', 'select', 'l3', 'r3', 'top', 'bottom', 'left', 'right', 'home', 'top', 'bottom', 'left', 'right', 'leftScrollY', 'rightScrollY']

const sound = {
    'top': 'move',
    'bottom': 'move',
    'left': 'move',
    'right': 'move',
    'a': 'select',
    'y': 'select',
    'b': 'back',
    'x': 'back',
    'select': 'switchup'
}

const scrollBooster = 15;

class GamepadApi {
    visible = true;
    gamepad;
    activeWrapper = ':root';
    root = document.getElementById('root');
    pressed = {};
    stickPress = {};

    constructor(gamepad) {
        this.gamepad = gamepad.index;
    }

    sendEvent = (detail) => {
        if (sound[detail]) {
            const audio = new Audio('/assets/sound/ui/' + sound[detail] + '.mp3');
            audio.play()
        }
        const body = document.querySelector('html');
        body.style.setProperty('cursor', 'none');
        body.style.setProperty('pointer-events', 'none');
        const event = new CustomEvent('gamepadbutton', {detail: detail});
        document.dispatchEvent(event);
        if (document.pointerLockElement === this.root) {
            this.root.requestPointerLock()
        }
    }

    initV2 = () => {
        if (!this.visible) return;
        const {axes: [horizontal, vertical, horizontalR, verticalR], buttons} = navigator.getGamepads()[this.gamepad];
        const pressed = buttons.reduce((acc, button, index) => {
            acc[index] = button.pressed;
            return acc;
        }, {})
        const stickPress = {
            17: (vertical < 0 && Math.abs(vertical) > 0.5) ? new Date().getTime() : false,
            18: (vertical > 0 && Math.abs(vertical) > 0.5) ? new Date().getTime() : false,
            19: (horizontal < 0 && Math.abs(horizontal) > 0.5) ? new Date().getTime() : false,
            20: (horizontal > 0 && Math.abs(horizontal) > 0.5) ? new Date().getTime() : false,
            21: (horizontalR < 0 && Math.abs(horizontalR) > 0.5) ? new Date().getTime() : false,
            22: (horizontalR > 0 && Math.abs(horizontalR) > 0.5) ? new Date().getTime() : false,
        }

        Object.entries(stickPress).forEach(([key, value]) => {
            if (value) {
                if (!this.stickPress[key]) {
                    this.sendEvent(keyMapping[key])
                    this.stickPress[key] = value;
                } else if (value - this.stickPress[key] >= 350) {
                    this.sendEvent(keyMapping[key])
                    this.stickPress[key] = value;
                }
            } else this.stickPress[key] = value;
        })

        Object.entries(pressed).forEach(([key, value]) => {
            if (!value && this.pressed[key] === true) this.sendEvent(keyMapping[key])
        })
        this.pressed = pressed;
        if (Math.abs(verticalR) > 0.3) { // scroll
            const root = document.querySelector(this.activeWrapper);
            root.scrollTop += verticalR * scrollBooster
        }
        setTimeout(() => window.requestAnimationFrame(this.initV2))
    }

    connect = () => {
        electronConnector.onVisibilityChange(visible => this.visible = visible);
        modalIsActive((active) => {
            this.activeWrapper = active ? '#modal #scroll' : ':root'
        })
        this.initV2()
    }

    disconnect = () => {
        window.cancelAnimationFrame(this.initV2);
    }

}

export default GamepadApi;