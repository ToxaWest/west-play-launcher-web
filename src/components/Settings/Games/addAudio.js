import styles from "../settings.module.scss";
import electronConnector from "../../../helpers/electronConnector";
import {useState} from "react";

const AddAudio = ({id, value, name, onChange}) => {
    const [query, setQuery] = useState(name);
    const [error, setError] = useState(null);
    const getAudio = () => {
        if (query) {
            setError(false)
            electronConnector.downloadAudio({id, query}).then(value => {
                if (!value) {
                    setError(true)
                    return;
                }
                onChange({
                    name: 'audio',
                    value
                })
            }, () => {
                setError(true)
            })
        }
    }


    return (
        <label className={styles.addImage}>
            <div className={styles.addImageField} style={{width: '100%'}}>
                <button tabIndex={1} onClick={getAudio} style={{whiteSpace: 'nowrap'}}>Get Audio</button>
                    <input style={{margin: '0 var(--gap)', width: '100%'}} value={query} onChange={(e) => {
                        setQuery(e.target.value)
                    }}/>
                {value ? <span>{value}</span> : null}
                {error ? <span>Error, try change name</span> : null}
            </div>
        </label>
    )
}

export default AddAudio;