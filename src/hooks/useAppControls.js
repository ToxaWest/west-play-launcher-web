import {useEffect, useRef} from "react";

const NAVIGATION_KEYS = {
    right: {colPosition: (a) => a + 1},
    left: {colPosition: (a) => a - 1},
    bottom: {rowPosition: (a) => a + 1},
    top: {rowPosition: (a) => a - 1}
}

const useAppControls = () => {
    const ref = useRef([]);
    const refRowsMatrix = useRef([]);
    const refCurrentIndex = useRef(0);
    const refCurrentTempIndex = useRef(0);
    const refCurrentTemp2Index = useRef(0);
    const prevLocation = useRef(window.location.pathname);
    const observer = useRef(null);
    const activeWrapper = useRef(null);
    const mapRef = useRef({});

    const setMatrix = (s) => {
        ref.current = document.querySelectorAll(activeWrapper.current + ' ' + s)
        const {matrix} = [...ref.current].reduce(({matrix, keys}, current, index) => {
            const {top} = current.getBoundingClientRect()
            if (typeof keys[top] !== "number") keys[top] = Object.keys(keys).length;
            if (!matrix[keys[top]]) matrix[keys[top]] = []
            matrix[keys[top]].push(index)
            return {matrix, keys}
        }, {keys: {}, matrix: []})
        refRowsMatrix.current = matrix;
    }

    const getBackWindow = () => {
        refCurrentIndex.current = 0
        if (window.__back) {
            const {id, url} = window.__back;
            if (url === window.location.pathname) {
                refCurrentIndex.current = [...ref.current].findIndex(({id: _id}) => _id === id.toString());
                window.__back = null;
            }
        }
        return refCurrentIndex.current
    }

    const checkNode = (nodeList, ind) => {
        return [...nodeList].some((node) => {
            try {
                if (node.hasAttribute('tabindex')) return node.tabIndex === ind;
                return node.querySelectorAll(`[tabindex="${ind}"]`).length > 0
            } catch {
                return false;
            }
        })
    }

    const logChanges = (e) => {
        const added = e.some(({addedNodes}) => checkNode(addedNodes, 1))
        const removed = e.some(({removedNodes}) => checkNode(removedNodes, 1))
        const subAdded = e.some(({addedNodes}) => checkNode(addedNodes, 2))
        const subRemoved = e.some(({removedNodes}) => checkNode(removedNodes, 2))

        if (added) {
            setMatrix('[tabindex="1"]')
            if (prevLocation.current !== window.location.pathname) {
                refCurrentTemp2Index.current = 0;
                prevLocation.current = window.location.pathname
                setCurrentIndex(getBackWindow)
            } else refCurrentTemp2Index.current = refCurrentIndex.current
        } else if (removed) {
            setMatrix('[tabindex="1"]')
            if (prevLocation.current === window.location.pathname) setCurrentIndex(() => refCurrentTemp2Index.current)
            else setCurrentIndex(() => 0)
        } else if (subAdded) {
            refCurrentTempIndex.current = refCurrentIndex.current;
            setMatrix('[tabindex="2"]')
            setCurrentIndex(() => 0)
        } else if (subRemoved) {
            setMatrix('[tabindex="1"]')
            setCurrentIndex(() => refCurrentTempIndex.current)
        }
    }

    const init = (selector) => {
        activeWrapper.current = selector;
        setMatrix('[tabindex="1"]')
        setCurrentIndex(() => 0)
        observer.current = new MutationObserver(logChanges);
        observer.current.observe(document.querySelector(selector), {childList: true, subtree: true});
    }

    const setCurrentIndex = (func) => {
        const i = func(refCurrentIndex.current);
        if (refCurrentIndex.current === i) {
            if (ref.current[i]) {
                ref.current[i]?.focus();
                return;
            } else {
                // refCurrentIndex.current = 0;
                // setActiveIndex(0)
            }

            return;
        }
        refCurrentIndex.current = i;
        setActiveIndex(i)
    }

    const getPosition = ({i, rowPosition = (i) => i, colPosition = (i) => i}) => {
        const currentRow = refRowsMatrix.current.findIndex((a) => a.includes(i));
        const currentCol = refRowsMatrix.current[currentRow]?.findIndex((a) => a === i);
        const _newCol = refRowsMatrix.current[rowPosition(currentRow)]?.[colPosition(currentCol)]
        if (typeof _newCol === "number") return _newCol
        return i
    }

    const listener = ({detail}) => {
        if (mapRef.current[detail]) {
            mapRef.current[detail]()
        }

        if (!ref.current.length) return

        if (NAVIGATION_KEYS[detail]) {
            setCurrentIndex((i) => getPosition({i, ...NAVIGATION_KEYS[detail]}))
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
            ref.current[index].scrollIntoView({inline: 'center', block: 'center', behavior: 'smooth',})
            ref.current[index].focus();
        }
    }

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        return () => {
            if (observer.current) observer.current.disconnect()
            document.removeEventListener('gamepadbutton', listener)
        }
    }, []);

    return {
        init, setMap: (r) => {
            mapRef.current = r
        }
    }
}

export default useAppControls