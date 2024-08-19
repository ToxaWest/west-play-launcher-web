import {useEffect, useRef, useState} from "react";

const useAppControls = ({map}) => {
    const ref = useRef([]);
    const selected = useRef(0);
    const [currentIndex, setActive] = useState(0);

    const init = (selector) => {
        if (selector) {
            ref.current = document.querySelectorAll(selector)
            focus(0)
        }
    }

    const focus = (i) => {
        ref.current[i].scrollIntoView({
            inline: 'center',
            block: 'center',
            behavior: 'smooth',
        })
        ref.current[i].focus();
    }

    const listener = ({detail}) => {
        Object.entries(map).forEach(([key, funk]) => {
            if (detail === key) {
                let i = funk(selected.current);
                if (i < 0) i = ref.current.length - 1
                if (i === ref.current.length) i = 0
                if (ref.current[i]) {
                    selected.current = i;
                    setActive(i)
                    focus(i)
                }
            }
        })
    }

    const setActiveIndex = (index) => {
        selected.current = index;
        setActive(index);
        focus(index)
    }

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        return () => {
            document.removeEventListener('gamepadbutton', listener)
        }
    }, []);

    return {
        init,
        setActiveIndex,
        currentIndex,
    }
}

export default useAppControls