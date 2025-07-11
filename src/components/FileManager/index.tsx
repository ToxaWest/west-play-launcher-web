import React, {startTransition, useActionState} from "react";

import electronConnector from "../../helpers/electronConnector";
import useFooterActions from "../../hooks/useFooterActions";
import type {FileManagerFolderType} from "../../types/electron.types";
import Loader from "../Loader";

import styles from "./FileManager.module.scss";

import SvgFile from '../../SVG/file.svg?react'
import SvgFolder from '../../SVG/folder-open.svg?react'

const FileManager = ({
                         file = true,
                         submit,
                         initial = ''
                     }: {
    file?: boolean,
    initial?: string,
    submit?: (path: string) => void,
}) => {
    const [disks, setDisks] = React.useState<string[]>([]);
    const currentFolder = React.useRef<string>(initial);
    const {removeFooterActions, setFooterActions} = useFooterActions()
    const [folders, getFolders, loading] = useActionState<Promise<FileManagerFolderType[]>, string>((_state, f) => electronConnector.getFolders(f), [])

    const getChild = (f: string) => {
        currentFolder.current = f
        startTransition(() => getFolders(f))
    }

    React.useEffect(() => {
        setFooterActions({
            b: {
                button: 'b',
                onClick: () => {
                    if (currentFolder.current) {
                        const a = currentFolder.current.split('/');
                        if (a.length > 1) {
                            a.pop()
                            getChild(a.join('/') + (a.length === 1 ? '/' : ''))
                        }
                    }
                },
                title: 'Back'
            },
            x: {
                button: 'x',
                onClick: () => {
                    submit(null)
                },
                title: 'Close',
            }
        })
        if (file) {
            setFooterActions({
                y: {
                    button: 'y',
                    onClick: () => {
                        submit(currentFolder.current)
                    },
                    title: 'Select'
                }
            })
        }
        electronConnector.getDisks().then(setDisks);
        if (initial) getChild(initial)

        return () => {
            removeFooterActions(['b', 'x', 'y']);
        }
    }, []);

    const backIndex = (index: number) => {
        if (currentFolder.current) {
            const a = currentFolder.current.split('/');
            if (a.length > 1) {
                a.length = index + 1;
                getChild(a.join('/') + (a.length === 1 ? '/' : ''))
            }
        }
    }

    const renderPathItem = (name: string, index: number) => (
        <span key={name} onClick={() => {
            backIndex(index)
        }} tabIndex={1} role="button">{name}/</span>
    )

    const renderFolderItem = ({name, isFolder, path}: FileManagerFolderType) => (
        <li key={name} tabIndex={1} role="button"
            data-path={file ? path : (isFolder ? path : '')}
            onClick={() => {
                if (isFolder) getChild(path)
                else {
                    if (file) submit(path)
                }
            }}>
            {isFolder ? <SvgFolder/> : <SvgFile/>} {name}
        </li>
    )

    const renderDiskItem = (disk: string) => (
        <li key={disk} tabIndex={1} role="button" onClick={() => {
            getChild(disk)
        }}>
            {disk}
        </li>
    )

    return (
        <div className={styles.modal}>
            <div className={styles.wrapper}>
                <span className={styles.currentPath}>
                    {currentFolder.current.split('/').map(renderPathItem)}
                </span>
                <ul className={styles.diskList}>
                    {disks.map(renderDiskItem)}
                </ul>
                <ul className={styles.folders} id={'scroll'}>
                    {folders.map(renderFolderItem)}
                    <Loader loading={loading}/>
                </ul>
            </div>
        </div>
    )
}

export default FileManager