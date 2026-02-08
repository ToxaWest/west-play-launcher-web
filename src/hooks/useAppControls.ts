import {useEffect, useRef} from "react";
import type {appControlsMap} from "@type/provider.types";

const NAVIGATION_KEYS = {
    bottom: {rowPosition: (a: number): number => a + 1},
    left: {colPosition: (a: number): number => a - 1},
    right: {colPosition: (a: number): number => a + 1},
    top: {rowPosition: (a: number): number => a - 1}
}

const useAppControls = () => {
    const elementsRef = useRef<NodeListOf<HTMLElement>>([] as undefined as NodeListOf<HTMLElement>);
    const rowsMatrixRef = useRef<number[][]>([]);
    const currentIndexRef = useRef<number>(0);
    const currentTempIndexRef = useRef<number>(0);
    const currentTemp2IndexRef = useRef<number>(0);
    const prevLocationRef = useRef<string>(window.location.pathname);
    const observerRef = useRef<MutationObserver>(null);
    const activeWrapperRef = useRef<string>(null);
    const mapRef = useRef<appControlsMap>({});

    const setMatrix = (s: string) => {
        elementsRef.current = document.querySelectorAll(activeWrapperRef.current + ' ' + s)
        const {matrix} = [...elementsRef.current].reduce(({matrix, keys}, current, index) => {
            const {top} = current.getBoundingClientRect()
            let topRounded = Math.round(top)
            Object.keys(keys).forEach((key) => {
                if (Math.abs(topRounded - parseInt(key)) < 15) topRounded = parseInt(key)
            })
            if (typeof keys[topRounded] !== "number") keys[topRounded] = Object.keys(keys).length;
            if (!matrix[keys[topRounded]]) matrix[keys[topRounded]] = []
            matrix[keys[topRounded]].push(index)
            return {keys, matrix}
        }, {keys: {}, matrix: []})
        rowsMatrixRef.current = matrix;
    }

    const getBackWindow = () => {
        currentIndexRef.current = 0
        if (window.__back) {
            const {id, url} = window.__back;
            if (url === window.location.pathname) {
                currentIndexRef.current = [...elementsRef.current].findIndex(({id: _id}) => _id === id.toString());
                window.__back = null;
            }
        }
        return currentIndexRef.current
    }

    const checkNode = (nodeList: NodeList, tabIndexLevel: number) => {
        return [...nodeList].some((node: HTMLElement) => {
            try {
                if (node.hasAttribute('tabindex')) return node.tabIndex === tabIndexLevel;
                return node.querySelectorAll(`[tabindex="${tabIndexLevel}"]`).length > 0
            } catch {
                return false;
            }
        })
    }

    const logChanges = (e: MutationRecord[]) => {
        const added = e.some(({addedNodes}) => checkNode(addedNodes, 1))
        const removed = e.some(({removedNodes}) => checkNode(removedNodes, 1))
        const subAdded = e.some(({addedNodes}) => checkNode(addedNodes, 2))
        const subRemoved = e.some(({removedNodes}) => checkNode(removedNodes, 2))

        if (added) {
            setMatrix('[tabindex="1"]')
            if (prevLocationRef.current !== window.location.pathname) {
                currentTemp2IndexRef.current = 0;
                prevLocationRef.current = window.location.pathname
                setCurrentIndex(getBackWindow)
            } else currentTemp2IndexRef.current = currentIndexRef.current
        } else if (removed) {
            setMatrix('[tabindex="1"]')
            if (prevLocationRef.current === window.location.pathname) setCurrentIndex(() => currentTemp2IndexRef.current)
            else setCurrentIndex(() => 0)
        } else if (subAdded) {
            currentTempIndexRef.current = currentIndexRef.current;
            setMatrix('[tabindex="2"]')
            setCurrentIndex(() => 0)
        } else if (subRemoved) {
            setMatrix('[tabindex="1"]')
            setCurrentIndex(() => currentTempIndexRef.current)
        }
    }

    const init = (selector: string) => {
        activeWrapperRef.current = selector;
        setMatrix('[tabindex="1"]')
        setCurrentIndex(() => 0)
        observerRef.current = new MutationObserver(logChanges);
        observerRef.current.observe(document.querySelector(selector), {childList: true, subtree: true});
    }

    const setCurrentIndex = (func: (a: number) => number) => {
        const i = func(currentIndexRef.current);
        if (currentIndexRef.current === i) {
            if (elementsRef.current[i]) {
                elementsRef.current[i]?.focus();
                return;
            } else {
                // currentIndexRef.current = 0;
                // setActiveIndex(0)
            }

            return;
        }
        currentIndexRef.current = i;
        setActiveIndex(i)
    }

    const getPosition = (
        {i, rowPosition = (i) => i, colPosition = (i) => i, button}: {
            i: number,
            rowPosition: (a: number) => number,
            colPosition: (a: number) => number,
            button: string,
        }) => {
        const currentRow = rowsMatrixRef.current.findIndex((a) => a.includes(i));
        const currentCol = rowsMatrixRef.current[currentRow]?.findIndex((a) => a === i);
        const _newCol = rowsMatrixRef.current[rowPosition(currentRow)]?.[colPosition(currentCol)]
        if (typeof _newCol === "number") return _newCol
        if (button === 'bottom') {
            if (rowsMatrixRef.current[currentRow + 1]) return rowsMatrixRef.current[currentRow + 1].at(0)
        }
        if (button === 'top') {
            if (rowsMatrixRef.current[currentRow - 1]) return rowsMatrixRef.current[currentRow - 1].at(0)
        }
        return i
    }

    const listener = ({detail: {button}}) => {
        if (mapRef.current[button]) mapRef.current[button]()

        if (!elementsRef.current.length) return

        if (NAVIGATION_KEYS[button]) {
            setCurrentIndex((i) => getPosition({i, ...NAVIGATION_KEYS[button], button}))
        }
    }

    const setActiveIndex = (index: number) => {
        if (index < 0) {
            setCurrentIndex(() => elementsRef.current.length - 1);
            return
        }
        if (index >= elementsRef.current.length) {
            setCurrentIndex(() => 0)
            return;
        }
        if (elementsRef.current[index]) {
            elementsRef.current[index].focus();
            document.activeElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }
    }

    useEffect(() => {
        document.addEventListener('gamePadClick', listener)
        return () => {
            if (observerRef.current) observerRef.current.disconnect()
            document.removeEventListener('gamePadClick', listener)
        }
    }, []);

    return {
        init, setMap: (actions: appControlsMap) => {
            mapRef.current = actions
        }
    }
}

export default useAppControls