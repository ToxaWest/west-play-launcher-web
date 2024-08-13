import {createContext, useState} from "react";
import useGamepadButtons from "../hooks/useGamepadButtons";

export const AppContext = createContext({active: false, pressedKeys: []});

const Provider = ({children}) => {
    const [menu, setMenu] = useState(false);
    const {pressedKeys} = useGamepadButtons();

    return (
        <AppContext.Provider value={{active: !menu, setMenu, pressedKeys}}>
            {children}
        </AppContext.Provider>
    )
}

export default Provider