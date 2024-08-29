import {useEffect, useRef} from "react";

const styles = {
    position: "fixed",
    right: '25px',
    top: '20px',
    color: 'rgb(var(--theme-contrast))',
    fontSize: '20px',
    fontWeight: 'bold',
    zIndex: '20'
}

const Clock = () => {
    const ref = useRef(null);

    function startTime() {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        if (ref.current) {
            ref.current.innerHTML = h + ":" + m + ":" + s;
        }
        setTimeout(startTime, 1000);
    }

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i;
    }

    useEffect(() => {
        startTime()
    }, []);

    return <div style={styles} ref={ref}/>
}

export default Clock