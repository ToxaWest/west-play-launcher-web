import {useContext} from "react";
import {AppContext} from "../helpers/provider";

const usePrevPath = () => {
    const {prevPath, setPrevPath} = useContext(AppContext);
    return {prevPath, setPrevPath};
}

export default usePrevPath