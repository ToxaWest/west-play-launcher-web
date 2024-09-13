import {useEffect, useRef, useState} from "react";
import electronConnector from "../helpers/electronConnector";

const keyMapping = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'options', 'select', 'l3', 'r3', 'top', 'bottom', 'left', 'right', 'home']

const sound = {
    'top': 'move',
    'bottom': 'move',
    'left': 'move',
    'right': 'move',
    'a': 'select',
    'b': 'back',
    'x': 'back',
    'select': 'switchup'
}

const scrollBooster = 15;

const useGamepadButtons = () => {
    const [visible, setVisible] = useState(true);
    const pressedRef = useRef(null);
    const connectedRef = useRef(false);

    const sendEvent = (detail) => {
        if (sound[detail]) {
            const audio = new Audio('/assets/sound/ui/' + sound[detail] + '.mp3');
            audio.play()
        }
        const body = document.querySelector('html');
        body.style.setProperty('cursor', 'none');
        body.style.setProperty('pointer-events', 'none');
        const event = new CustomEvent('gamepadbutton', {detail: detail});
        document.dispatchEvent(event);
    }

    const buttonsEvent = (e) => {
        if (!pressedRef.current) {
            sendEvent(e);
            pressedRef.current = e
        }
    }

    const init = () => {
        const [gamepad] = navigator.getGamepads()
        if (!gamepad || !visible) {
            return;
        }

        const pressed = gamepad.buttons.findIndex((button) => button.pressed)

        if (pressed !== -1) {
            buttonsEvent(keyMapping[pressed])
        } else {
            pressedRef.current = null;
        }
        setTimeout(() => window.requestAnimationFrame(init), 50)
    }

    const initLeftStick = () => {
        const [gamepad] = navigator.getGamepads()
        if (!gamepad || !visible) {
            return;
        }

        const vertical = gamepad.axes[1]
        const horizontal = gamepad.axes[0]

        if (Math.abs(vertical) > 0.5) {
            sendEvent(keyMapping[vertical < 0 ? 12 : 13])
        }
        if (Math.abs(horizontal) > 0.5) {
            sendEvent(keyMapping[horizontal < 0 ? 14 : 15])
        }
        setTimeout(() => window.requestAnimationFrame(initLeftStick), 120)
    }

    const initScroll = () => {
        const [gamepad] = navigator.getGamepads()
        if (!gamepad) {
            return;
        }
        const verticalR = gamepad.axes[3]
        if (Math.abs(verticalR) > 0.3) {
            const modal = document.querySelector('#modal #scroll');
            const root = document.querySelector(':root');
            if (modal) {
                modal.scrollTop += verticalR * scrollBooster
            } else {
                root.scrollTop += verticalR * scrollBooster
            }
            sendEvent(verticalR < 0 ? 'topScrollY' : 'bottomScrollY')
        }

        setTimeout(() => window.requestAnimationFrame(initScroll))
    }

    useEffect(() => {
        electronConnector.onVisibilityChange(setVisible)
        window.addEventListener("gamepadconnected", (e) => {
            if (!connectedRef.current) {
                connectedRef.current = e.gamepad.id
                init();
                initLeftStick();
                initScroll();
            }
        })
        window.addEventListener('gamepaddisconnected', (e) => {
            if (e.gamepad.id === connectedRef.current) {
                connectedRef.current = false
                window.cancelAnimationFrame(init);
                window.cancelAnimationFrame(initLeftStick);
                window.cancelAnimationFrame(initScroll);
            }
        })
        return () => {
            window.api.removeAllListeners('onVisibilityChange')
        }

    }, []);
}

export default useGamepadButtons;