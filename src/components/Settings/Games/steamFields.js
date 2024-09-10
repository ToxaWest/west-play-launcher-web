import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";

const SteamFields = ({game, onChange}) => {
    const args = game.exeArgs || {};

    const getExePath = (name) => {
        electronConnector.getFile().then(value => {
            onChange({name, value})
        })
    }

    return (
        <>
            <Input label='Exe file path'
                   value={game.exePath}
                   onChange={onChange}
                   name='exePath'>
                <button onClick={() => getExePath('exePath')}>Get EXE Path</button>
            </Input>
            <Input label='Achievements file path'
                   value={game.achPath}
                   disabled={true}
                   name='achPath'>
                <button onClick={() => getExePath('achPath')}>Get Achievements Path</button>
            </Input>
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