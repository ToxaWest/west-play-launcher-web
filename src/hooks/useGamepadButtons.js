import {useEffect, useRef, useState} from "react";
import electronConnector from "../helpers/electronConnector";
import {modalIsActive} from "../helpers/modalIsActive";

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

const useGamepadButtons = () => {
    const [visible, setVisible] = useState(true);
    const pressedRef = useRef(null);
    const pressedRef2 = useRef(null);
    const activeWrapper = useRef(':root');

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

    const getGamePad = () => navigator.getGamepads().find(a => a);

    const init = () => {
        const gamepad = getGamePad()
        if (!gamepad || !visible) return
        const pressed = gamepad.buttons.findIndex((button) => button.pressed)
        if (pressed !== -1) buttonsEvent(keyMapping[pressed])
        else pressedRef.current = null
        setTimeout(() => window.requestAnimationFrame(init), 50)
    }

    const initLeftStick = () => {
        const gamepad = getGamePad()
        if (!gamepad || !visible) return;
        const [horizontal, vertical] = gamepad.axes
        if (Math.abs(vertical) > 0.5) sendEvent(keyMapping[vertical < 0 ? 12 : 13])
        if (Math.abs(horizontal) > 0.5) sendEvent(keyMapping[horizontal < 0 ? 14 : 15])
        setTimeout(() => window.requestAnimationFrame(initLeftStick), 120)
    }

    const initScroll = () => {
        const gamepad = getGamePad()
        if (!gamepad) return;
        const [, , horizontal, verticalR] = gamepad.axes
        if (Math.abs(verticalR) > 0.3) {
            const root = document.querySelector(activeWrapper.current);
            root.scrollTop += verticalR * scrollBooster
            sendEvent(verticalR < 0 ? 'topScrollY' : 'bottomScrollY')
        }

        if (Math.abs(horizontal) > 0.5) {
            if (!pressedRef2.current) {
                sendEvent(horizontal < 0 ? 'leftScrollY' : 'rightScrollY');
                pressedRef2.current = true
            }
        } else pressedRef2.current = null;

        setTimeout(() => window.requestAnimationFrame(initScroll))
    }

    const connect = () => {
        init();
        initLeftStick();
        initScroll();
    }

    const disconnect = () => {
        window.cancelAnimationFrame(init);
        window.cancelAnimationFrame(initLeftStick);
        window.cancelAnimationFrame(initScroll);
    }

    useEffect(() => {
        electronConnector.onVisibilityChange(setVisible)
        window.addEventListener("gamepadconnected", connect)
        window.addEventListener('gamepaddisconnected', disconnect)
        modalIsActive((active) => {
            activeWrapper.current = active ? '#modal #scroll' : ':root'
        })
        return () => {
            window.api.removeAllListeners('onVisibilityChange')
            window.removeEventListener('gamepadconnected', connect)
            window.removeEventListener('gamepaddisconnected', disconnect)
        }

    }, []);
}

export default useGamepadButtons;