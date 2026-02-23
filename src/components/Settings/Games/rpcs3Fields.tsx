import React from "react";
import type {Game} from "@type/game.types";

import i18n from "../../../helpers/translate";
import Input from "../../Input";

const Rpcs3Fields = ({game, onChange}: {
    game: Game,
    onChange: (e: { name: string, value: any }) => void,
}) => {
    const update = (e: {name: string, value: string}) => {
        onChange({
            name: 'exeArgs',
            value: {
                ...(game.exeArgs || {}),
                [e.name]: e.value
            }
        })
    }

    const fields = [{
        label: i18n.t('Full Screen'),
        name: 'fullscreen',
        options: ['--fullscreen'],
        type: 'select',
        value: game.exeArgs?.fullscreen,
    }, {
        label: i18n.t('No GUI'),
        name: 'noGui',
        options: ['--no-gui'],
        type: 'select',
        value: game.exeArgs?.noGui,
    }, {
        label: i18n.t('No Console'),
        name: 'noConsole',
        options: ['--no-console'],
        type: 'select',
        value: game.exeArgs?.noConsole,
    }]

    return (
        <div className="flex flex-col gap-gap-half">
            <Input label={i18n.t('Game ID')}
                   value={game.id}
                   onChange={onChange}
                   name='id'/>
            <div className="my-gap-half mx-0 [&_span]:text-[13px] [&_label]:p-theme [&_label_div]:flex [&_label_button]:m-[2px_2px_2px_auto]">
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
        </div>
    )
}

export default Rpcs3Fields;