import {useContext, useEffect, useRef} from "react";
import {AppContext} from "../helpers/provider";

const useAppControls = ({map, animation, abstract = false, isMenu = false}) => {
    const ref = useRef([]);
    const selected = useRef(0);
    const {pressedKeys, active} = useContext(AppContext);

    const init = ({selector} = {}) => {
        if (selector) {
            ref.current = document.querySelectorAll(selector)
        }
    }

    useEffect(() => {
        if (
            (isMenu ? !active : active) &&
            ref.current.length > 0
        ) {
            ref.current[0].focus();
            selected.current = 0;
        }
    }, [active, ref.current.length]);

    useEffect(() => {

        if (
            pressedKeys.length > 0 &&
            (isMenu ? !active : active) &&
            ref.current.length > 0
        ) {
            if (![...ref.current].some(e => e === document.activeElement)) {
                ref.current[0].focus();
                selected.current = 0;
            }

            console.log(document.activeElement)

            Object.entries(map).forEach(([key, funk]) => {
                if (pressedKeys.some(a => a === key)) {
                    let i = funk(selected.current);
                    if (i < 0) {
                        i = ref.current.length - 1
                    }
                    if (i === ref.current.length) {
                        i = 0
                    }

                    ref.current[i].focus();
                    selected.current = i;
                    if (animation) {
                        animation(ref.current[i])
                    }
                }
            })
        }

        if (abstract && pressedKeys.length > 0) {
            Object.entries(map).forEach(([key, funk]) => {
                if (pressedKeys.some(a => a === key)) {
                    funk(selected.current);
                }
            })
        }


    }, [JSON.stringify(pressedKeys)]);

    return {
        init,
        currentIndex: selected.current,
    }
}

export default useAppControls