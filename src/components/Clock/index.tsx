import React from "react";

import Alarm from "./alarm";
import Weather from "./weather";


const styles: React.CSSProperties = {
    alignItems: "center",
    color: 'var(--theme-text-color)',
    display: "flex",
    fontSize: '20px',
    fontWeight: 'bold',
    gap: 'var(--gap)',
    position: "fixed",
    right: 'var(--gap)',
    top: '0',
    zIndex: '20'
}

const Clock = () => {
    const ref = React.useRef<HTMLDivElement>(null);

    function startTime() {
        const today = new Date();
        const h = today.getHours();
        const m = checkTime(today.getMinutes());
        if (ref.current) {
            ref.current.innerHTML = h + ":" + m;
        }
        setTimeout(startTime, 1000);
    }

    function checkTime(i: number): string | number {
        if (i < 10) return "0" + i;
        return i;
    }

    React.useEffect(startTime, [startTime]);

    return (
        <div style={styles}>
            <Alarm/>
            <Weather/>
            <div ref={ref}/>
        </div>
    )
}

export default Clock