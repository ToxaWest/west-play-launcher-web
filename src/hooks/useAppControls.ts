import {useEffect, useRef} from "react";
import type {appControlsMap} from "@type/provider.types";

const NAVIGATION_KEYS = {
    bottom: {rowPosition: (a: number): number => a + 1},
    left: {colPosition: (a: number): number => a - 1},
    right: {colPosition: (a: number): number => a + 1},
    top: {rowPosition: (a: number): number => a - 1}
}

const useAppControls = () => {
    const ref = useRef<NodeListOf<HTMLElement>>([] as undefined as NodeListOf<HTMLElement>);
    const refRowsMatrix = useRef<number[][]>([]);
    const refCurrentIndex = useRef<number>(0);
    const refCurrentTempIndex = useRef<number>(0);
    const refCurrentTemp2Index = useRef<number>(0);
    const prevLocation = useRef<string>(window.location.pathname);
    const observer = useRef<MutationObserver>(null);
    const activeWrapper = useRef<string>(null);
    const mapRef = useRef<appControlsMap>({});

    const setMatrix = (s: string) => {
        ref.current = document.querySelectorAll(activeWrapper.current + ' ' + s)
        const {matrix} = [...ref.current].reduce(({matrix, keys}, current, index) => {
            const {top} = current.getBoundingClientRect()
            if (typeof keys[Math.round(top)] !== "number") keys[Math.round(top)] = Object.keys(keys).length;
            if (!matrix[keys[Math.round(top)]]) matrix[keys[Math.round(top)]] = []
            matrix[keys[Math.round(top)]].push(index)
            return {keys, matrix}
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

    const init = (selector: string) => {
        activeWrapper.current = selector;
        setMatrix('[tabindex="1"]')
        setCurrentIndex(() => 0)
        observer.current = new MutationObserver(logChanges);
        observer.current.observe(document.querySelector(selector), {childList: true, subtree: true});
    }

    const setCurrentIndex = (func: (a: number) => number) => {
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

    const getPosition = (
        {i, rowPosition = (i) => i, colPosition = (i) => i, button}: {
            i: number,
            rowPosition: (a: number) => number,
            colPosition: (a: number) => number,
            button: string,
        }) => {
        const currentRow = refRowsMatrix.current.findIndex((a) => a.includes(i));
        const currentCol = refRowsMatrix.current[currentRow]?.findIndex((a) => a === i);
        const _newCol = refRowsMatrix.current[rowPosition(currentRow)]?.[colPosition(currentCol)]
        if (typeof _newCol === "number") return _newCol
        if (button === 'bottom') {
            if (refRowsMatrix.current[currentRow + 1]) return refRowsMatrix.current[currentRow + 1].at(0)
        }
        if (button === 'top') {
            if (refRowsMatrix.current[currentRow - 1]) return refRowsMatrix.current[currentRow - 1].at(0)
        }
        return i
    }

    const listener = ({detail: {button}}) => {
        if (mapRef.current[button]) mapRef.current[button]()

        if (!ref.current.length) return

        if (NAVIGATION_KEYS[button]) {
            setCurrentIndex((i) => getPosition({i, ...NAVIGATION_KEYS[button], button}))
        }
    }

    const setActiveIndex = (index: number) => {
        if (index < 0) {
            setCurrentIndex(() => ref.current.length - 1);
            return
        }
        if (index >= ref.current.length) {
            setCurrentIndex(() => 0)
            return;
        }
        if (ref.current[index]) {
            ref.current[index].focus();
            document.activeElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }
    }

    useEffect(() => {
        document.addEventListener('gamePadClick', listener)
        return () => {
            if (observer.current) observer.current.disconnect()
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