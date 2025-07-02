import {useEffect, useState} from "react";
import Input from "../Input";

const CategoryFinder = ({data, goTo}) => {
    const [current, setCurrent] = useState({})
    useEffect(() => {
        const [v1, v2] = data;
        setCurrent({[v1.id]: v1.options[0].value, [v2.id]: v2.options[0].value})
    }, [data])

    return (
        <div>
            {data.map((d) => (
                <Input key={d.id} type="select" label={''} value={current[d.id]} options={d.options}
                       onChange={({value, name}) => {
                           if (!value) return
                           setCurrent(a => ({...a, [name]: value}))
                       }}/>
            ))}
            <button
                disabled={!Object.values(current).every(v => v)}
                tabIndex={1}
                onClick={() => {
                    const url = `${current["select-category"]}${current["select-year"] === '0' ? '' : current["select-year"]}`
                    goTo(url)
                }}>Submit
            </button>
        </div>
    )
}

export default CategoryFinder