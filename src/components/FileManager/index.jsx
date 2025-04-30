import {useEffect, useRef, useState} from "react";
import electronConnector from "../../helpers/electronConnector";
import styles from "./FileManager.module.scss";
import SvgFolder from '../../SVG/folder-open.svg?react'
import SvgFile from '../../SVG/file.svg?react'
import useFooterActions from "../../hooks/useFooterActions";
import Loader from "../Loader";

const FileManager = ({
                         file = true, submit = () => {
    }, initial = ''
                     }) => {
    const [disks, setDisks] = useState([]);
    const [folders, setFolders] = useState([]);
    const currentFolder = useRef(initial);
    const [loading, setLoading] = useState(false);
    const {removeFooterActions, setFooterActions} = useFooterActions()

    useEffect(() => {
        setFooterActions({
            b: {
                button: 'b',
                title: 'Back',
                onClick: () => {
                    if (currentFolder.current) {
                        const a = currentFolder.current.split('/');
                        if (a.length > 1) {
                            a.pop()
                            getChild(a.join('/') + (a.length === 1 ? '/' : ''))
                        }
                    }
                }
            },
            x: {
                button: 'x',
                title: 'Close',
                onClick: () => {
                    submit()
                }
            },
            ...(file ? {} : {
                y: {
                    button: 'y',
                    title: 'Select',
                    onClick: () => {
                        submit(currentFolder.current)
                    }
                }
            })
        })
        electronConnector.getDisks().then(setDisks);
        if (initial) getChild(initial)

        return () => {
            removeFooterActions(['b', 'x', 'y']);
        }
    }, []);

    const getChild = (f) => {
        setLoading(true)
        electronConnector.getFolders(f).then((child) => {
            currentFolder.current = f
            setFolders(child);
            setLoading(false)
        })
    }

    const backIndex = (index) => {
        if (currentFolder.current) {
            const a = currentFolder.current.split('/');
            if (a.length > 1) {
                a.length = index + 1;
                getChild(a.join('/') + (a.length === 1 ? '/' : ''))
            }
        }
    }

    const renderPathItem = (name, index) => (
        <span key={name} onClick={() => {
            backIndex(index)
        }} tabIndex={1}>{name}/</span>
    )

    const renderFolderItem = ({name, isFolder, path}) => (
        <li key={name} tabIndex={1}
            data-path={file ? path : (isFolder ? path : '')}
            onClick={() => {
                if (isFolder) {
                    getChild(path)
                } else {
                    if (file) {
                        submit(path)
                    }
                }
            }}>
            {isFolder ? <SvgFolder/> : <SvgFile/>} {name}
        </li>
    )

    const renderDiskItem = (disk) => (
        <li key={disk} tabIndex={1} onClick={() => {
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