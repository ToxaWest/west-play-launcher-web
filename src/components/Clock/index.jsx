import {useEffect, useRef} from "react";
import Weather from "./weather";

const styles = {
    display: "flex",
    alignItems: "center",
    gap: 'var(--gap)',
    position: "fixed",
    right: 'var(--gap)',
    top: '0',
    color: 'var(--theme-text-color)',
    fontSize: '20px',
    fontWeight: 'bold',
    zIndex: '20'
}

const Clock = () => {
    const ref = useRef(null);

    function startTime() {
        const today = new Date();
        const h = today.getHours();
        const m = checkTime(today.getMinutes());
        if (ref.current) {
            ref.current.innerHTML = h + ":" + m;
        }
        setTimeout(startTime, 1000);
    }

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i;
    }

    useEffect(startTime, []);

    return (
        <div style={styles}>
            <Weather/>
            <div ref={ref}/>
        </div>
    )
}

export default Clock