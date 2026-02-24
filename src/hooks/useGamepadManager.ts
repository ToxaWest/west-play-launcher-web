import React from "react";
import type {appControlsMap} from "@type/provider.types";

import GamepadApi from "../helpers/gamepad";

const NAVIGATION_KEYS = {
    bottom: {rowPosition: (a: number): number => a + 1},
    left: {colPosition: (a: number): number => a - 1},
    right: {colPosition: (a: number): number => a + 1},
    top: {rowPosition: (a: number): number => a - 1}
}

export const useGamepadManager = () => {
    const gamepadsRef = React.useRef<Map<number, GamepadApi>>(new Map());
    const elementsRef = React.useRef<NodeListOf<HTMLElement>>([] as undefined as NodeListOf<HTMLElement>);
    const rowsMatrixRef = React.useRef<number[][]>([]);
    const currentIndexRef = React.useRef<number>(0);
    const currentTempIndexRef = React.useRef<number>(0);
    const prevLocationRef = React.useRef<string>(window.location.pathname);
    const observerRef = React.useRef<MutationObserver>(null);
    const activeWrapperRef = React.useRef<string>(null);
    const mapRef = React.useRef<appControlsMap>({});

    const setMatrix = (s: string) => {
        if (!activeWrapperRef.current) return;
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

    const setActiveIndex = (index: number) => {
        if (!elementsRef.current.length) return;
        
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
            elementsRef.current[index].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }
    }

    const setCurrentIndex = (func: (a: number) => number) => {
        if (!elementsRef.current.length) return;
        const i = func(currentIndexRef.current);
        if (currentIndexRef.current === i) {
            if (elementsRef.current[i]) {
                elementsRef.current[i]?.focus();
                return;
            }
            return;
        }
        currentIndexRef.current = i;
        setActiveIndex(i)
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

    const checkNode = (node: Node, tabIndexLevel: number): boolean => {
        if (!(node instanceof HTMLElement)) return false;
        if (node.tabIndex === tabIndexLevel) return true;
        return node.querySelectorAll(`[tabindex="${tabIndexLevel}"]`).length > 0;
    }

    const logChanges = (mutations: MutationRecord[]) => {
        let tabLevel1Changed = false;
        let tabLevel2Changed = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const added1 = [...mutation.addedNodes].some(node => checkNode(node, 1));
                const removed1 = [...mutation.removedNodes].some(node => checkNode(node, 1));
                const added2 = [...mutation.addedNodes].some(node => checkNode(node, 2));
                const removed2 = [...mutation.removedNodes].some(node => checkNode(node, 2));

                if (added1 || removed1) tabLevel1Changed = true;
                if (added2 || removed2) tabLevel2Changed = true;
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'tabindex') {
                const target = mutation.target as HTMLElement;
                if (target.tabIndex === 1) tabLevel1Changed = true;
                if (target.tabIndex === 2) tabLevel2Changed = true;
            }
        }

        if (tabLevel1Changed || tabLevel2Changed) {
            setTimeout(() => {
                const hasLevel2 = document.querySelectorAll(activeWrapperRef.current + ' [tabindex="2"]').length > 0;
                const currentMatrixLevel = elementsRef.current.length > 0 && elementsRef.current[0].tabIndex === 2 ? 2 : 1;

                if (hasLevel2 && currentMatrixLevel === 1) {
                    currentTempIndexRef.current = currentIndexRef.current;
                    setMatrix('[tabindex="2"]')
                    setCurrentIndex(() => 0)
                } else if (!hasLevel2 && currentMatrixLevel === 2) {
                    setMatrix('[tabindex="1"]')
                    setCurrentIndex(() => currentTempIndexRef.current)
                } else {
                    const currentFocused = document.activeElement;
                    setMatrix(currentMatrixLevel === 2 ? '[tabindex="2"]' : '[tabindex="1"]')
                    
                    if (prevLocationRef.current !== window.location.pathname) {
                        prevLocationRef.current = window.location.pathname
                        setCurrentIndex(getBackWindow)
                    } else {
                        const newIndex = [...elementsRef.current].indexOf(currentFocused as HTMLElement);
                        if (newIndex !== -1) {
                            currentIndexRef.current = newIndex;
                        } else if (!document.activeElement || document.activeElement === document.body || !elementsRef.current[currentIndexRef.current]) {
                            setCurrentIndex(() => 0)
                        }
                    }
                }
            }, 0);
        }
    }

    const getPosition = (
        {i, rowPosition = (i) => i, colPosition = (i) => i, button}: {
            i: number,
            rowPosition?: (a: number) => number,
            colPosition?: (a: number) => number,
            button: string,
        }) => {
        const currentRow = rowsMatrixRef.current.findIndex((a) => a.includes(i));
        const currentCol = rowsMatrixRef.current[currentRow]?.findIndex((a) => a === i);

        if (button === 'left' || button === 'right') {
            const nextCol = colPosition(currentCol);
            const target = rowsMatrixRef.current[currentRow]?.[nextCol];
            if (typeof target === "number") return target;
            return i;
        }

        let nextRowIndex: number;
        if (currentRow === -1) {
            if (button === 'bottom') nextRowIndex = 0;
            else if (button === 'top') nextRowIndex = rowsMatrixRef.current.length - 1;
            else return i;
        } else {
            nextRowIndex = (rowPosition(currentRow) + rowsMatrixRef.current.length) % rowsMatrixRef.current.length;
        }
        
        const nextRow = rowsMatrixRef.current[nextRowIndex];

        if (nextRow) {
            const currentEl = elementsRef.current[i];
            if (!currentEl) return nextRow[0];
            
            const currentRect = currentEl.getBoundingClientRect();
            const currentCenter = currentRect.left + currentRect.width / 2;

            let closestIndex = nextRow[0];
            let minDistance = Infinity;

            nextRow.forEach(index => {
                const targetEl = elementsRef.current[index];
                if (!targetEl) return;
                const targetRect = targetEl.getBoundingClientRect();
                const targetCenter = targetRect.left + targetRect.width / 2;
                const distance = Math.abs(currentCenter - targetCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });
            return closestIndex;
        }

        return i
    }

    const listener = ({detail: {button}}: CustomEvent<{button: string}>) => {
        if (mapRef.current[button]) {
            mapRef.current[button]();
            return;
        }

        if (button === 'a') {
            const activeElement = document.activeElement as HTMLElement;
            if (activeElement && activeElement !== document.body) {
                activeElement.focus();
                activeElement.click();
                return;
            }
        }

        if (!elementsRef.current.length) return

        if (NAVIGATION_KEYS[button as keyof typeof NAVIGATION_KEYS]) {
            setCurrentIndex((i) => getPosition({i, ...NAVIGATION_KEYS[button as keyof typeof NAVIGATION_KEYS], button}))
        }
    }

    const init = (selector: string) => {
        activeWrapperRef.current = selector;
        setMatrix('[tabindex="1"]')
        setCurrentIndex(() => 0)
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new MutationObserver(logChanges);
        const target = document.querySelector(selector);
        if (target) {
            observerRef.current.observe(target, {
                attributeFilter: ['tabindex'],
                attributes: true, 
                childList: true, 
                subtree: true
            });
        }
    }

    const setMap = (actions: appControlsMap) => {
        Object.entries(actions).forEach(([key, value]) => {
            if (value === null) delete mapRef.current[key];
            else mapRef.current[key] = value;
        });
    }

    React.useEffect(() => {
        const handleGamepadConnected = (e: GamepadEvent) => {
            const { gamepad } = e;
            const gp = new GamepadApi(gamepad);
            gp.connect();
            gamepadsRef.current.set(gamepad.index, gp);
        };

        const handleGamepadDisconnected = (e: GamepadEvent) => {
            const { gamepad } = e;
            const gp = gamepadsRef.current.get(gamepad.index);
            if (gp) {
                gp.disconnect();
                gamepadsRef.current.delete(gamepad.index);
            }
        };

        window.addEventListener("gamepadconnected", handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
        document.addEventListener('gamePadClick', listener as EventListener);

        return () => {
            window.removeEventListener("gamepadconnected", handleGamepadConnected);
            window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
            document.removeEventListener('gamePadClick', listener as EventListener);
            if (observerRef.current) observerRef.current.disconnect();
            gamepadsRef.current.forEach(gp => gp.disconnect());
            gamepadsRef.current.clear();
        };
    }, []);

    return { init, setMap };
}
