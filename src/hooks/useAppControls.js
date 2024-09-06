import {useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

const useAppControls = ({map} = {map: {}}) => {
    const ref = useRef([]);
    const refRowsMatrix = useRef([]);
    const refCurrentIndex = useRef(0);
    const observer = useRef(null);
    const location = useLocation();

    const setMatrix = () => {
        const {matrix} = [...ref.current].reduce(({matrix, keys}, current, index) => {
            const {top} = current.getBoundingClientRect()
            if (typeof keys[top] !== "number") keys[top] = Object.keys(keys).length;
            if (!matrix[keys[top]]) matrix[keys[top]] = []
            matrix[keys[top]].push(index)
            return {matrix, keys}
        }, {keys: {}, matrix: []})

        refRowsMatrix.current = matrix;
    }

    useEffect(() => {
        refCurrentIndex.current = 0;
    }, [location]);


    const getBackWindow = () => {
        if (window.__back) {
            const {index, url} = window.__back;
            if (url === window.location.pathname) {
                setTimeout(() => {
                    ref.current[index].scrollIntoView({inline: 'center', block: 'center'});
                    window.__back = null;
                })
                return index
            }
        }
        return refCurrentIndex.current
    }

    const init = (selector) => {
        if (selector) {
            ref.current = document.querySelectorAll(selector)
            if (ref.current.length) {
                setMatrix()
                setCurrentIndex(getBackWindow)
            }
            const [parent] = selector.split(' ')
            const logChanges = () => {
                ref.current = document.querySelectorAll(selector)
                if (ref.current.length) {
                    setMatrix()
                    setCurrentIndex(getBackWindow)
                }
            }
            observer.current = new MutationObserver(logChanges);
            observer.current.observe(document.querySelector(parent), {childList: true, subtree: true});
        }
    }

    const setCurrentIndex = (func) => {
        const i = func(refCurrentIndex.current);
        refCurrentIndex.current = i;
        setActiveIndex(i)
    }

    const getPosition = ({i, rowPosition = (i) => i, colPosition = (i) => i}) => {
        const currentRow = refRowsMatrix.current.findIndex((a) => a.includes(i));
        const currentCol = refRowsMatrix.current[currentRow]?.findIndex((a) => a === i);
        const _newCol = refRowsMatrix.current[rowPosition(currentRow)]?.[colPosition(currentCol)]
        if (typeof _newCol === "number") {
            return _newCol
        }
        return i
    }

    const navKeys = {
        right: {colPosition: (a) => a + 1},
        left: {colPosition: (a) => a - 1},
        bottom: {rowPosition: (a) => a + 1},
        top: {rowPosition: (a) => a - 1}
    }

    const listener = ({detail}) => {
        if (map[detail]) {
            map[detail]()
        }

        if (!ref.current.length) {
            return
        }

        if (navKeys[detail]) {
            setCurrentIndex((i) => getPosition({i, ...navKeys[detail]}))
        }
    }

    const setActiveIndex = (index) => {
        if (index < 0) {
            setCurrentIndex(() => ref.current.length - 1);
            return
        }
        if (index >= ref.current.length) {
            setCurrentIndex(() => 0)
            return;
        }
        if (ref.current[index]) {
            refCurrentIndex.current = index;
            ref.current[index].scrollIntoView({
                inline: 'center',
                block: 'center',
                behavior: 'smooth',
            })
            ref.current[index].focus();
        }
    }

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
            document.removeEventListener('gamepadbutton', listener)
        }
    }, []);

    return {
        init
    }
}

export default useAppControls