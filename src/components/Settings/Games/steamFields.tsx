import React from "react";
import type {Game} from "@type/game.types";

import i18n from "../../../helpers/translate";
import Input from "../../Input";

const SteamFields = ({game, onChange}: {
    game: Game
    onChange: (e: { name: string, value: any }) => void,
}) => {
    const args = game.exeArgs || {};

    return (
        <div className="flex flex-col gap-gap-half">
            <Input label={i18n.t('Exe file path')}
                   value={game.exePath}
                   onChange={onChange}
                   type="path"
                   initial={game.path}
                   onlyFile={true}
                   name='exePath'/>
            <div className="my-gap-half mx-0 flex flex-col gap-gap-half">
                <button
                    type="button"
                    className="mr-auto"
                    onClick={() => {
                        onChange({
                            name: 'exeArgs',
                            value: {...args, [(parseInt(Object.keys(args).at(-1)) || 0) + 1]: ''}
                        })
                    }}>{i18n.t('Add starting argument')}
                </button>
                {Object.entries(args).map(([id, value], index) => (
                    <Input label={i18n.t('Argument {{index}}', {index: index + 1})}
                           value={value}
                           key={id}
                           onChange={({value, name}) => {
                               onChange({
                                   name: 'exeArgs',
                                   value: {...args, [name]: value}
                               })
                           }}
                           name={id}>
                        <button
                            type="button"
                            className="m-[2px_2px_2px_auto]"
                            onClick={() => {
                                delete args[id];
                                onChange({
                                    name: 'exeArgs',
                                    value: {...args}
                                })
                            }}>{i18n.t('Remove argument')}
                        </button>
                    </Input>
                ))}
            </div>
            {game.source === 'steam' ? <Input label={i18n.t('Achievements file path')}
                                              value={game.achPath}
                                              onChange={onChange}
                                              type="path"
                                              onlyFile={true}
                                              name='achPath'/> : null}
        </div>
    )
}

export default SteamFields;