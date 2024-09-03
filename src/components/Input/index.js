import styles from './input.module.scss';
import {useState} from "react";

const Input = ({
                   label, value, name, onChange = () => {
    }, children,
                   type = 'text',
                   options,
                   disabled,
                   _ref
               }) => {

    const [active, setActive] = useState(false);

    const change = (e) => {
        onChange({
            name: e.target.name,
            value: e.target.value
        })
    }

    const renderInput = {
        text: () => {
            return (
                <input type="text"
                       placeholder={label}
                       name={name}
                       ref={_ref}
                       disabled={disabled}
                       defaultValue={value}
                       onChange={change}
                />
            )
        },
        number: () => {
            return (
                <input type="number"
                       placeholder={label}
                       name={name}
                       ref={_ref}
                       disabled={disabled}
                       defaultValue={value}
                       onChange={change}
                />
            )
        },
        select: () => {
            const data = typeof options[0] === 'object' ? options : options.map(a => ({label: a, value: a}))
            const getValue = () => {
                if (typeof value !== null && value !== undefined) {
                    return data.find(a => a.value === value)?.label || 'select value'
                }
                return 'select value'
            }
            return (
                <div className={styles.select} onClick={() => setActive((a) => !a)}>
                    <span>{getValue()}</span>
                    {active && <ul>
                        {[{label: 'empty', value: null}, ...data].map((option) => (
                            <li key={option.value} onClick={() => {
                                onChange({
                                    value: option.value,
                                    name
                                })
                            }}>{option.label}</li>
                        ))}
                    </ul>
                    }
                </div>
            )
        }
    }

    return (
        <label className={styles.wrapper}>
            <span>{label || name}:</span>
            {renderInput[type]()}
            <div className={styles.child}>
                {children}
            </div>
        </label>
    )
}

export default Input