import Input from "../../Input";
import styles from "../settings.module.scss";
import {useState} from "react";
import Modal from "../../Modal";
import FileManager from "../../FileManager";

const SteamFields = ({game, onChange}) => {
    const args = game.exeArgs || {};
    const [openFileManager, setOpenFileManager] = useState(false);

    return (
        <>
            {Boolean(openFileManager) && <Modal onClose={() => setOpenFileManager(false)}>
                <FileManager submit={(value) => {
                    onChange({value, name: openFileManager})
                    setOpenFileManager(false)
                }} file={true} initial={game[openFileManager] || ''}/>
            </Modal>}
            <Input label='Exe file path'
                   value={game.exePath}
                   onChange={onChange}
                   disabled={true}
                   name='exePath'>
                <button tabIndex={1} onClick={() => setOpenFileManager('exePath')}>Get EXE Path</button>
            </Input>
            <Input label='Achievements file path'
                   value={game.achPath}
                   disabled={true}
                   name='achPath'>
                <button tabIndex={1} onClick={() => setOpenFileManager('achPath')}>Get Achievements Path</button>
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