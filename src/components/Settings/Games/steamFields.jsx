import Input from "../../Input";
import styles from "../settings.module.scss";

const SteamFields = ({game, onChange}) => {
    const args = game.exeArgs || {};

    return (
        <>
            <Input label='Exe file path'
                   value={game.exePath}
                   onChange={onChange}
                   type="path"
                   initial={game.path}
                   onlyFile={true}
                   name='exePath'/>
            <Input label={'Exe file path'}
                   name="exePath"
                   value={game.exePath}
                   onChange={onChange}
            />
            {game.source === 'steam' ? <Input label='Achievements file path'
                                              value={game.achPath}
                                              onChange={onChange}
                                              type="path"
                                              onlyFile={true}
                                              name='achPath'/> : null}
            <div className={styles.argsWrapper}>
                <button onClick={() => {
                    onChange({
                        name: 'exeArgs',
                        value: {...args, [(parseInt(Object.keys(args).at(-1)) || 0) + 1]: ''}
                    })
                }}>Add starting argument
                </button>
                {Object.entries(args).map(([id, value], index) => (
                    <Input label={'Argument ' + (index + 1)}
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
                            onClick={() => {
                                delete args[id];
                                onChange({
                                    name: 'exeArgs',
                                    value: {...args}
                                })
                            }}>Remove argument
                        </button>
                    </Input>
                ))}
            </div>
        </>
    )
}

export default SteamFields;