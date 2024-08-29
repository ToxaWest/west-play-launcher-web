import {useEffect, useRef, useState} from "react";
import electronConnector from "../helpers/electronConnector";
import useNotification from "./useNotification";

const keyMapping = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'options', 'select', 'l3', 'r3', 'top', 'bottom', 'left', 'right', 'home']

const sound = {
    'top': 'move',
    'bottom': 'move',
    'left': 'move',
    'right': 'move',
    'a': 'select',
    'b': 'back',
    'select': 'switchup'
}

const useGamepadButtons = () => {
    const [visible, setVisible] = useState(true);
    const pressedRef = useRef(null);
    const connectedRef = useRef(false);
    const notifications = useNotification();

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
        const gamepad = navigator.getGamepads()[0]
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
        const gamepad = navigator.getGamepads()[0]
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
        const gamepad = navigator.getGamepads()[0]
        if (!gamepad) {
            return;
        }
        const verticalR = gamepad.axes[3]

        if (verticalR < -0.5) {
            window.scrollBy(0, -5)
        }
        if (verticalR > 0.5) {
            window.scrollBy(0, 5)
        }

        setTimeout(() => window.requestAnimationFrame(initScroll))
    }

    useEffect(() => {
        const audio = new Audio('/assets/sound/ui/swits.mp3')

        electronConnector.onVisibilityChange(setVisible)
        window.addEventListener("gamepadconnected", (e) => {
            if (!connectedRef.current) {
                audio.play()
                connectedRef.current = e.gamepad.id
                notifications({
                    img: '/assets/controller/xbox-control-for-one.svg',
                    status: 'success',
                    name: 'Gamepad connected',
                    description: 'Let\'s Play!'
                })
                init();
                initLeftStick();
                initScroll();
                //boost scroll
                initScroll();
            }
        })
        window.addEventListener('gamepaddisconnected', (e) => {
            if (e.gamepad.id === connectedRef.current) {
                connectedRef.current = false
                notifications({
                    img: '/assets/controller/xbox-control-for-one.svg',
                    status: 'error',
                    name: 'Gamepad disconnected',
                    description: ''
                })
                window.cancelAnimationFrame(init);
                window.cancelAnimationFrame(initLeftStick);
                window.cancelAnimationFrame(initScroll);
            }
        })

    }, []);
}

export default useGamepadButtons;