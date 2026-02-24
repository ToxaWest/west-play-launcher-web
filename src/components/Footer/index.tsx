import React from "react";
import useAppControls from "@hook/useAppControls";
import useFooterActions from "@hook/useFooterActions";
import type {gamePadButtonName} from "@type/gamePad.types";
import type {appControlsMap, footerActionsType, footerActionType} from "@type/provider.types";
import {useNavigate} from "react-router-dom";

import i18n from "../../helpers/translate";

const Footer = () => {
    const navigate = useNavigate();
    const {footerActions} = useFooterActions();
    const {setMap} = useAppControls()

    const menuButton = () => {
        if (window.location.pathname === '/menu') navigate(-1);
        else navigate('/menu')
    }

    const imgMapping: { [key in gamePadButtonName]?: string } = {
        a: 'a-filled-green.svg',
        b: 'b-filled red.svg',
        bottom: 'dpad-down.svg',
        lb: 'left-bumper.svg',
        lt: 'left-trigger.svg',
        rb: 'right-bumper.svg',
        rt: 'right-trigger.svg',
        select: 'menu.svg',
        top: 'dpad-up.svg',
        x: 'x-filled-blue.svg',
        y: 'y-filled-yellow.svg'
    }

    React.useEffect(() => {
        const allButtons: gamePadButtonName[] = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'options', 'select', 'l3', 'r3', 'top', 'bottom', 'left', 'right', 'home'];
        
        const newMap = allButtons.reduce((acc, button) => {
            acc[button] = null; // Default to clear
            return acc;
        }, {} as appControlsMap);

        Object.values(footerActions).forEach(action => {
            newMap[action.button] = action.onClick;
        });
        
        newMap.select = menuButton;

        setMap(newMap);
    }, [footerActions]);

    const actions: footerActionsType = {
        ...footerActions,
        select: {
            button: 'select',
            onClick: menuButton,
            title: i18n.t('Menu')
        }
    }

    const renderFooterActions = ({onClick, title, button}: footerActionType, index: number) => (
        <div onClick={onClick} role="button" tabIndex={0} key={button} className={`flex items-center cursor-pointer gap-2.5 group ${index === 0 ? 'mr-auto' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:bg-white/10 group-hover:scale-110 transition-all duration-200">
                <img src={'/assets/controller/' + imgMapping[button]} alt={title} className="w-8 h-8 object-contain filter drop-shadow-sm"/>
            </div>
            <span className="text-[1.4vh] font-bold tracking-wider opacity-70 group-hover:opacity-100 transition-opacity uppercase whitespace-nowrap">{title}</span>
        </div>
    )

    const orderMap: Map<gamePadButtonName, number> = new Map([
        ['a', 9],
        ['b', 10],
        ['bottom', 2],
        ['lb', 3],
        ['lt', 5],
        ['rb', 4],
        ['rt', 6],
        ['select', 0],
        ['top', 1],
        ['x', 7],
        ['y', 8]
    ]);


    const sortButtons = (a: footerActionType, b: footerActionType) => orderMap.get(a.button) - orderMap.get(b.button)

    return (
        <footer className="fixed! inset-x-0 h-[50px] bottom-0 px-gap flex items-center gap-gap transition-opacity duration-300 ease-in z-[6] glass">
            {Object.values(actions).filter(a => a.title).sort(sortButtons).map(renderFooterActions)}
        </footer>
    )
}

export default Footer