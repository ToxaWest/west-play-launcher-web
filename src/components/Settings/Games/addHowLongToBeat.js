import styles from "../settings.module.scss";
import electronConnector from "../../../helpers/electronConnector";
import {useState} from "react";

const AddHowLongToBeat = ({id, value, name, onChange}) => {
    const [query, setQuery] = useState(name);
    const [error, setError] = useState(null);

    const getData = () => {
        if (query) {
            setError(false)
            electronConnector.howLongToBeat(query).then(data => {
                if (!data) {
                    setError(true)
                    return;
                }
                if(id){
                    const res = data.data.find(({profile_steam}) => profile_steam === parseInt(id));
                    if(res){
                        onChange({
                            name: 'howLongToBeat',
                            value: res
                        })
                        return
                    }
                }
                if(data.data.length === 1){
                    onChange({
                        name: 'howLongToBeat',
                        value: data.data[0]
                    })
                    return
                }

                onChange({
                    name: 'howLongToBeat',
                    value: data.data[0]
                })
            }, () => {
                setError(true)
            })
        }
    }


    return (
        <label className={styles.addImage}>
            <div className={styles.addImageField} style={{width: '100%'}}>
                <button onClick={getData} style={{whiteSpace: 'nowrap'}}>Get HLTB</button>
                    <input style={{margin: '0 var(--gap)', width: '100%'}} value={query} onChange={(e) => {
                        setQuery(e.target.value)
                    }}/>
                {value ? <span>{value.game_name}</span> : null}
                {error ? <span>Error, try change name</span> : null}
            </div>
        </label>
    )
}

export default AddHowLongToBeat;