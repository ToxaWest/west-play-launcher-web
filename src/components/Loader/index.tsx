import React, {CSSProperties} from "react";

const Loader = ({loading, style}: { loading: boolean, style?: CSSProperties }) => {
    if (!loading) return null

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-theme-transparent z-[10]" style={style}>
            <div className="w-12 h-12 border-4 border-secondary border-t-text rounded-full animate-spin"></div>
        </div>
    )
}

export default Loader