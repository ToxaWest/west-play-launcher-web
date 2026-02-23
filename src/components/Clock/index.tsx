import React from "react";

import Alarm from "./alarm";
import Weather from "./weather";

const Clock = () => {
    const clockRef = React.useRef<HTMLDivElement>(null);

    function startTime() {
        const today = new Date();
        const h = today.getHours();
        const m = checkTime(today.getMinutes());
        if (clockRef.current) {
            clockRef.current.innerHTML = h + ":" + m;
        }
        setTimeout(startTime, 1000);
    }

    function checkTime(i: number): string | number {
        if (i < 10) return "0" + i;
        return i;
    }

    React.useEffect(startTime, [startTime]);

    return (
        <div className="flex items-center text-text text-[20px] font-bold gap-gap fixed right-gap top-0 z-20">
            <Alarm/>
            <Weather/>
            <div ref={clockRef}/>
        </div>
    )
}

export default Clock