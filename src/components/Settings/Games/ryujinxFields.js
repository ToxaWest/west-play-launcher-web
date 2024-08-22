import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";
import {useState} from "react";

const RyujinxFields = ({setGame, game}) => {
    const [temp, setTemp] = useState([]);

    const getSwitchData = (s) => {
        setGame(g => ({
            ...g,
            nsuid: s.nsuid,
            required_age: s.rating,
            release_date: {
                date: new Date(s.releaseDate).toLocaleDateString("en-US")
            },
            developers: [s.softwareDeveloper, s.softwarePublisher],
            name: s.title,
            controller_support: 'full',
            supported_languages: null,
        }))
        electronConnector.nintendoReq(s.url).then((data) => {
            setGame(g => ({
                ...g,
                about_the_game: data.description
            }))
            setTemp([])
        })
    }

    const update = (e) => {
        setGame(a => {
            if (!a.exeArgs) {
                a.exeArgs = {}
            }
            a.exeArgs[e.name] = e.value
            return {...a}
        })
    }

    const getExePath = () => {
        electronConnector.getFile().then(exePath => {
            update({name: 'path', value: exePath})
        })
    }

    const fields = [{
        name: 'fullscreen',
        type: 'select',
        value: game.exeArgs?.fullscreen,
        options: ['--fullscreen'],
        label: 'Full Screen',
    }, {
        name: 'docked',
        type: 'select',
        value: game.exeArgs?.docked,
        options: ['--docked-mode', '--handheld-mode'],
        label: 'Docked Mode',
    }]

    return (
        <>
            <Input label='Search'
                   onChange={({value: q}) => {
                       electronConnector.nintendoSearch(q).then(e => {
                           console.log(e)
                           setTemp(e)
                       })
                   }}
                   children={<ul className={styles.search}>
                       {temp.map(s => (
                           <li key={s.id} onClick={() => {
                               getSwitchData(s)
                           }}>
                               <img src={s.image} alt={s.title}/>
                               <span>{s.title}</span>
                           </li>)
                       )}
                   </ul>}
                   name='search'/>
            <div className={styles.argsWrapper}>
                <Input label='NSP path'
                       disabled={true}
                       value={game.exeArgs?.path}
                       onChange={update}
                       name='path'>
                    <button onClick={() => getExePath()}>Get EXE Path</button>
                </Input>
                {fields.map(field => (
                    <Input label={field.label}
                           key={field.name}
                           value={field.value}
                           type={field.type}
                           options={field.options}
                           onChange={update}
                           name={field.name}/>
                ))}
            </div>
        </>
    )
}

export default RyujinxFields;