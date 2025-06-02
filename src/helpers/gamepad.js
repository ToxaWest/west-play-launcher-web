import electronConnector from "./electronConnector";
import {modalIsActive} from "./modalIsActive";
const keyMapping = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'options', 'select', 'l3', 'r3', 'top', 'bottom', 'left', 'right', 'home']

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
    pressedRef = null;
    pressedRef2 = null;

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

    buttonsEvent = (e) => {
        if (!this.pressedRef) {
            this.sendEvent(e);
            this.pressedRef = e
        }
    }

    init = () => {
        if (!this.visible) return
        const pressed = navigator.getGamepads()[this.gamepad].buttons.findIndex((button) => button.pressed)
        if (pressed !== -1) this.buttonsEvent(keyMapping[pressed])
        else this.pressedRef = null
        setTimeout(() => window.requestAnimationFrame(this.init), 50)
    }

    initLeftStick = () => {
        if (!this.visible) return;
        const [horizontal, vertical] = navigator.getGamepads()[this.gamepad].axes
        if (Math.abs(vertical) > 0.5) this.sendEvent(keyMapping[vertical < 0 ? 12 : 13])
        if (Math.abs(horizontal) > 0.5) this.sendEvent(keyMapping[horizontal < 0 ? 14 : 15])
        setTimeout(() => window.requestAnimationFrame(this.initLeftStick), 120)
    }

    initScroll = () => {
        const [, , horizontal, verticalR] = navigator.getGamepads()[this.gamepad].axes
        if (Math.abs(verticalR) > 0.3) {
            const root = document.querySelector(this.activeWrapper);
            root.scrollTop += verticalR * scrollBooster
            this.sendEvent(verticalR < 0 ? 'topScrollY' : 'bottomScrollY')
        }

        if (Math.abs(horizontal) > 0.5) {
            if (!this.pressedRef2) {
                this.sendEvent(horizontal < 0 ? 'leftScrollY' : 'rightScrollY');
                this.pressedRef2 = true
            }
        } else this.pressedRef2 = null;

        setTimeout(() => window.requestAnimationFrame(this.initScroll))
    }

    connect = () => {
        electronConnector.onVisibilityChange(visible => this.visible = visible);
        modalIsActive((active) => {
            this.activeWrapper = active ? '#modal #scroll' : ':root'
        })
        this.init();
        this.initLeftStick();
        this.initScroll();
    }

    disconnect = () => {
        window.cancelAnimationFrame(this.init);
        window.cancelAnimationFrame(this.initLeftStick);
        window.cancelAnimationFrame(this.initScroll);
    }

}

export default GamepadApi;