import styles from './input.module.scss';
import {useState} from "react";
import FileManager from "../FileManager";
import Modal from "../Modal";

const Input = ({
                   label, value = '', name, onChange = () => {
    }, children,initial = '',
                   type = 'text',
                   options,
                   disabled,
                   _ref,
                   onlyFile = false,
                   ...props
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
                       {...(disabled ? {disabled, value} : {defaultValue: value})}
                       onChange={change}
                />
            )
        },
        path: () => {
            return (
                <div className={styles.path}>
                    <input type={"hidden"} ref={_ref} value={value} name={name} style={{display: 'none'}}/>
                    <button tabIndex={1} onClick={() => setActive(true)}>Get path</button>
                    <span>{value}</span>
                    {active ? <Modal onClose={() => setActive(false)}>
                        <FileManager
                            submit={(value) => {
                                onChange({value, name})
                                setActive(false)
                            }}
                            file={onlyFile}
                            initial={initial || value || ''}/>
                    </Modal> : null}
                </div>
            )
        },
        number: () => {
            return (
                <input type="number"
                       {...props}
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
                <div className={styles.select} tabIndex={1} onClick={() => setActive((a) => !a)}>
                    <span>{getValue()}</span>
                    {active && <ul>
                        {[{label: 'empty', value: null}, ...data].map((option) => (
                            <li key={option.value} tabIndex={2} onClick={() => {
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