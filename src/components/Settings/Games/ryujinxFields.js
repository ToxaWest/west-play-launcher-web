import Input from "../../Input";
import styles from "../settings.module.scss";

const RyujinxFields = ({game, onChange}) => {
    const update = (e) => {
        onChange({
            name: 'exeArgs',
            value: {
                ...game.exeArgs,
                [e.name]: e.value
            }
        })
    }

    const fields = [{
        name: 'fullscreen',
        type: 'select',
        value: game.exeArgs.fullscreen,
        options: ['--fullscreen'],
        label: 'Full Screen',
    }, {
        name: 'docked',
        type: 'select',
        value: game.exeArgs.docked,
        options: ['--docked-mode', '--handheld-mode'],
        label: 'Docked Mode',
    }]

    return (
        <>
            <div className={styles.argsWrapper}>
                {fields.map(field => (
                    <Input label={field.label}
                           key={field.name}
                           value={field.value}
                           type={field.type}
                           options={field.options}
                           onChange={update}
                           name={field.name}/>
                ))}
            </div>
        </>
    )
}

export default RyujinxFields;