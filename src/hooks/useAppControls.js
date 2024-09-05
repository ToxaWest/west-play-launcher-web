import {useEffect, useRef, useState} from "react";

const useAppControls = ({map} = {map: {}}) => {
    const ref = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refRowsMatrix = useRef([]);

    const init = (selector, initialFocus = 0) => {
        if (selector) {
            ref.current = document.querySelectorAll(selector)
            const matrix = {};
            ref.current.forEach((a, i) => {
                const {top} = a.getBoundingClientRect()
                if (!matrix[top.toString()]) matrix[top.toString()] = []
                matrix[top.toString()].push(i)
            })
            refRowsMatrix.current = Object.values(matrix)
            setActiveIndex(initialFocus)
        }
    }

    const getPosition = (i) => {
        const currentRow = refRowsMatrix.current.findIndex((a) => a.includes(i));
        const currentCol = refRowsMatrix.current[currentRow].findIndex((a) => a === i);
        return {
            currentCol,
            currentRow
        }
    }

    const listener = ({detail}) => {
        Object.entries(map).forEach(([key, funk]) => {
            if (detail === key) {
                funk(ref.current[currentIndex])
            }
        })
        if (!ref.current.length) {
            return
        }
        if (detail === 'right') {
            setCurrentIndex((i) => {
                const {currentRow, currentCol} = getPosition(i);
                const _newCol = refRowsMatrix.current[currentRow][currentCol + 1]
                if (typeof _newCol === "number") {
                    return _newCol
                }

                return i
            })
        }
        if (detail === 'left') {
            setCurrentIndex((i) => {
                const {currentRow, currentCol} = getPosition(i);
                const _newCol = refRowsMatrix.current[currentRow][currentCol - 1]
                if (typeof _newCol === "number") {
                    return _newCol
                }
                return i
            })
        }

        if (detail === 'bottom') {
            setCurrentIndex((i) => {
                const {currentRow, currentCol} = getPosition(i);
                const _newCol = refRowsMatrix.current[currentRow + 1]?.[currentCol]
                if (typeof _newCol === "number") {
                    return _newCol
                }
                return i
            })
        }
        if (detail === 'top') {
            setCurrentIndex((i) => {
                const {currentRow, currentCol} = getPosition(i);
                const _newCol = refRowsMatrix.current[currentRow - 1]?.[currentCol]
                if (typeof _newCol === "number") {
                    return _newCol
                }
                return i
            })
        }
    }

    const setActiveIndex = (index) => {
        if (index < 0) {
            setCurrentIndex(ref.current.length - 1);
            return
        }
        if (index >= ref.current.length) {
            setCurrentIndex(0)
            return;
        }
        if (ref.current[index]) {
            ref.current[index].scrollIntoView({
                inline: 'center',
                block: 'center',
                behavior: 'smooth',
            })
            ref.current[index].focus();
            setCurrentIndex(index)
        }
    }

    useEffect(() => {
        setActiveIndex(currentIndex)
    }, [currentIndex])

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