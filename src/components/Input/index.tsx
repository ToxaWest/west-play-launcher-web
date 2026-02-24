import React from "react";
import useAppControls from "@hook/useAppControls";

import i18n from "../../helpers/translate";
import FileManager from "../FileManager";
import Modal from "../Modal";

type OptionType = {
    label: string | number,
    value: string | number,
    html?: string
}

const onChangeDefault = (data: { name: string, value: string | number }) => {
    console.log(data)
}

const Input = ({
                   label, value = '', name,
                   onChange = onChangeDefault,
                   children,
                   initial,
                   type = 'text',
                   options,
                   disabled,
                   _ref,
                   onlyFile = false,
                   ...props
               }: {
    onClick?: () => void,
    label?: string,
    value?: string | number,
    name?: string,
    initial?: string
    disabled?: boolean
    onlyFile?: boolean,
    _ref?: React.Ref<HTMLInputElement>,
    children?: React.ReactNode,
    type?: 'text' | 'number' | 'select' | 'path',
    onChange?: (data: { name: string, value?: string | number }) => void,
    options?: (string | number | OptionType)[],
}) => {

    const [active, setActive] = React.useState<boolean>(false);
    const {setMap} = useAppControls();
    const [initialValue, setInitialValue] = React.useState<string | number>(value)

    const change = (e: { target: { name: string, value: string | number } }) => {
        setInitialValue(e.target.value)
        onChange({
            name: e.target.name,
            value: e.target.value
        })
    }

    React.useEffect(() => {
        setInitialValue(value)
    }, [value])

    React.useEffect(() => {
        if (type === 'select' && active) {
            setMap({
                b: () => setActive(false)
            })
        } else if (type === 'select' && !active) {
            setMap({
                b: null
            })
        }

        return () => {
            if (type === 'select') {
                setMap({
                    b: null
                })
            }
        }
    }, [active, type])

    const inputClasses = "min-w-[450px] transition-colors focus:bg-text focus:text-theme focus:placeholder:text-secondary hover:bg-text hover:text-theme active:bg-text active:text-theme";

    const renderInput = {
        number: () => {
            return (
                <input type="number"
                       {...props}
                       placeholder={label}
                       name={name}
                       ref={_ref}
                       tabIndex={1}
                       disabled={disabled}
                       className={inputClasses}
                       value={value}
                       onChange={change}
                />
            )
        },
        path: () => {
            return (
                <div className="flex items-center justify-between w-full">
                    <button tabIndex={1} type="button" onClick={() => setActive(true)}>{i18n.t('Get path')}</button>
                    <input type={"text"} ref={_ref} name={name} tabIndex={0}
                           className={inputClasses}
                           value={initialValue}
                           onChange={({target: {value: pathValue}}) => {
                               setInitialValue(pathValue)
                           }}
                           onBlur={change}/>
                    {active ? <Modal onClose={() => setActive(false)}>
                        <FileManager
                            submit={(value) => {
                                onChange({name, value})
                                setActive(false)
                            }}
                            file={onlyFile}
                            initial={initial || (value as string) || ''}/>
                    </Modal> : null}
                </div>
            )
        },
        select: () => {
            if (!options || options.length === 0) return null
            const data: OptionType[] = options.reduce((acc, option) => {
                if (typeof option === 'object') {
                    if (acc.some(a => a.value === option.value)) return acc;
                    acc.push(option)
                } else {
                    if (acc.some(a => a.value === option)) return acc;
                    acc.push({label: option, value: option})
                }
                return acc
            }, [])
            const getValue = () => {
                if (typeof value === "number" || typeof value === "string") {
                    const cur = data.find(a => a.value === value);
                    if (!cur) return i18n.t('select value')
                    return cur.html ? <span dangerouslySetInnerHTML={{__html: cur.html}}/> : cur.label
                }
                return i18n.t('select value')
            }

            const renderOption = (option: OptionType) => (
                <li key={option.value?.toString()} role="button"
                    className={`text-[12px] cursor-pointer p-theme focus:bg-text focus:text-theme hover:bg-text hover:text-theme active:bg-text active:text-theme ${option.value === value ? 'bg-[green] text-white' : ''}`} tabIndex={2} onClick={() => {
                    onChange({name, value: option.value})
                    setActive(false)
                }}>
                    {option.html ? <span dangerouslySetInnerHTML={{__html: option.html}}/> : option.label}
                </li>
            )

            return (
                <div className="relative rounded-theme p-theme text-text border border-text-secondary bg-transparent min-w-[400px] hover:bg-text hover:text-theme focus:bg-text focus:text-theme active:bg-text active:text-theme" role="button" tabIndex={1} onClick={() => setActive((a) => !a)}>
                    <span className="text-[14px]">{getValue()}</span>
                    {active && <ul className="absolute top-[36px] left-0 min-w-full text-text bg-secondary p-gap-half z-[1] flex overflow-y-auto max-h-[400px] flex-col gap-gap-half list-none">{data.map(renderOption)}</ul>}
                </div>
            )
        },
        text: () => {
            return (
                <input type="text"
                       {...props}
                       placeholder={label}
                       name={name}
                       ref={_ref}
                       tabIndex={1}
                       className={inputClasses}
                       {...(disabled ? {disabled, value} : {value: initialValue})}
                       onChange={change}
                />
            )
        }
    }

    return (
        <label className="flex flex-wrap">
            <span className={!(label || name) ? 'hidden' : ''}>{label || name}:</span>
            {renderInput[type]()}
            <div className="w-full [&_ul:empty]:hidden">
                {children}
            </div>
        </label>
    )
}

export default Input