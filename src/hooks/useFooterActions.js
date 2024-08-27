import {useContext, useEffect} from "react";
import {AppContext} from "../helpers/provider";

const useFooterActions = () => {
    const {footerActions, setFooterActions} = useContext(AppContext);

    useEffect(() => {
        return () => {
            setFooterActions([]);
        }
    }, [])

    return {
        footerActions,
        setFooterActions
    }
}

export default useFooterActions;