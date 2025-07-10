import React from "react";

import Input from "../Input";

const CategoryFinder = ({data, goTo}: {
    data: {
        id: string,
        options: {
            value: string,
            label: string
        }[]
    }[]
    goTo: (url: string) => void
}) => {
    const [current, setCurrent] = React.useState({})
    React.useEffect(() => {
        const [v1, v2] = data;
        setCurrent({
            [v1.id]: v1.options[0].value,
            [v2.id]: v2.options[0].value
        })
    }, [data])

    return (
        <div>
            {data.map((d) => (
                <Input key={d.id} type="select" label={''} value={current[d.id]} options={d.options}
                       onChange={({value}) => {
                           if (!value) return
                           setCurrent(a => ({...a, [d.id]: value}))
                       }}/>
            ))}
            <button
                type="submit"
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