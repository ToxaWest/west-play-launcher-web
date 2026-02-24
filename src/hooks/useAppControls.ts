import {use} from "react";

import {AppContext} from "../helpers/provider";

const useAppControls = () => {
    const {init, setMap} = use(AppContext);

    return {
        init, 
        setMap
    }
}

export default useAppControls