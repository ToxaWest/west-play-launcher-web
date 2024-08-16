import {useEffect, useRef, useState} from "react";

const keyMapping = [
    'a',
    'b',
    'x',
    'y',
    'lb',
    'rb',
    'lt',
    'rt',
    'options',
    'select',
    'l3',
    'r3',
    'top',
    'bottom',
    'left',
    'right',
    'home',
    'rTop',
    'rBottom'
]

const sound = {
    'top': 'move',
    'bottom': 'move2',
    'left': 'move3',
    'right': 'move4',
    'a': 'select',
    'b': 'back',
    'home': 'switchup'
}

const useGamepadButtons = () => {
    const [pressedKeys, setPressedKeys] = useState([]);
    const ref = useRef([]);

    const sendEvent = (detail) => {
        if (JSON.stringify(ref.current) === JSON.stringify(detail)) {
            return;
        }
        if (sound[detail[0]]) {
            const a = document.createElement('audio');
            a.src = '/assets/sound/ui/' + sound[detail[0]] + '.mp3';
            a.play()
        }
        setPressedKeys(() => {
            ref.current = detail
            return detail
        });
    }

    const init = () => {
        const gamepad = navigator.getGamepads()[0]
        if (!gamepad) {
            return;
        }

        const vertical = gamepad.axes[1]
        const horizontal = gamepad.axes[0]

        const pressed = gamepad.buttons.reduce((prev, button, currentIndex) => {
            if (button.pressed) {
                return [...prev, keyMapping[currentIndex]]
            }
            return prev
        }, [])

        if (pressed.length > 0 ||
            vertical < -0.5 ||
            vertical > 0.5 ||
            horizontal < -0.5 ||
            horizontal > 0.5
        ) {
            if (pressed.length > 0) {
                sendEvent(pressed)
            }
            if (
                vertical < -0.5 ||
                vertical > 0.5 ||
                horizontal < -0.5 ||
                horizontal > 0.5
            ) {
                if (vertical < -0.5) {
                    sendEvent([keyMapping[12]])
                }
                if (vertical > 0.5) {
                    sendEvent([keyMapping[13]])
                }

                if (horizontal < -0.5) {
                    sendEvent([keyMapping[14]])
                }

                if (horizontal > 0.5) {
                    sendEvent([keyMapping[15]])
                }
            }
        } else {
            sendEvent([])
        }

        setTimeout(() => window.requestAnimationFrame(init), 50)
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
        window.addEventListener("gamepadconnected", () => {
            init();
            initScroll();
            //boost scroll
            initScroll();
        })
    }, []);

    return {
        pressedKeys
    }
}

export default useGamepadButtons;