import {cloneElement, useEffect, useRef, useState} from "react";

const GamePadNavigation = ({children, defaultIndex = 0, focusedIndex = () => null}) => {
    const ref = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(defaultIndex);
    const refRowsMatrix = useRef([]);

    const getPosition = (i) => {
        const currentRow = refRowsMatrix.current.findIndex((a) => a.includes(i));
        const currentCol = refRowsMatrix.current[currentRow].findIndex((a) => a === i);
        return {
            currentCol,
            currentRow
        }
    }

    const listener = ({detail}) => {
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
            setCurrentIndex(children.length - 1);
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
            focusedIndex(index)
        }
    }

    useEffect(() => {
        setActiveIndex(currentIndex)
    }, [currentIndex])

    useEffect(() => {
        const matrix = {};
        ref.current.forEach((a, i) => {
            const {top} = a.getBoundingClientRect()
            if (!matrix[top.toString()]) matrix[top.toString()] = []
            matrix[top.toString()].push(i)
        })
        refRowsMatrix.current = Object.values(matrix)
        setActiveIndex(currentIndex)
    }, [children]);

    useEffect(() => {
        document.addEventListener('gamepadbutton', listener)
        return () => {
            document.removeEventListener('gamepadbutton', listener)
        }
    }, []);

    const addRef = (child, index) => cloneElement(child, {

        onClick: (e) => {
            setCurrentIndex(index)
            if (child.props?.onClick) {
                child.props.onClick(e);
            }
        },
        ref: (r) => ref.current[index] = r
    })


    return children.map(addRef)
}

export default GamePadNavigation;