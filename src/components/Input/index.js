import styles from './input.module.scss';
import {useState} from "react";

const Input = ({
                   label, value, name, onChange, children,
                   type = 'text',
                   options,
                   disabled
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
                       disabled={disabled}
                       defaultValue={value}
                       onChange={change}
                />
            )
        },
        select: () => {
            return (
                <div className={styles.select} onClick={() => setActive((a) => !a)}>
                    <span >{value || 'select value'}</span>
                    {active && <ul>
                        {['empty', ...options].map((option) => (
                            <li key={option} onClick={() => {
                                onChange({
                                    value: option,
                                    name
                                })
                            }}>{option}</li>
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