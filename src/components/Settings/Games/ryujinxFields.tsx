import React from "react";
import type {Game} from "@type/game.types";

import Input from "../../Input";

import styles from "../settings.module.scss";

const RyujinxFields = ({game, onChange}: {
    game: Game,
    onChange: (e: { name: string, value: any }) => void,
}) => {
    const update = (e: {name: string, value: string}) => {
        onChange({
            name: 'exeArgs',
            value: {
                ...game.exeArgs,
                [e.name]: e.value
            }
        })
    }

    const fields = [{
        label: 'Full Screen',
        name: 'fullscreen',
        options: ['--fullscreen'],
        type: 'select',
        value: game.exeArgs.fullscreen,
    }, {
        label: 'Docked Mode',
        name: 'docked',
        options: ['--docked-mode', '--handheld-mode'],
        type: 'select',
        value: game.exeArgs.docked,
    }]

    return (
        <>
            <div className={styles.argsWrapper}>
                {fields.map(field => (
                    <Input label={field.label}
                           key={field.name}
                           value={field.value}
                           type={field.type as 'select'}
                           options={field.options}
                           onChange={update}
                           name={field.name}/>
                ))}
            </div>
        </>
    )
}

export default RyujinxFields;