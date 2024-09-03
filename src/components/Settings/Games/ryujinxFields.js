import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";
import {useRef, useState} from "react";

const RyujinxFields = ({setGame, game, getGamePath, setLoading}) => {
    const [temp, setTemp] = useState([]);
    const searchRef = useRef(null);
    const getSwitchData = (s) => {
        setLoading(true)
        setGame(g => ({
            ...g,
            nsuid: s.nsuid,
            required_age: s.contentRatingCode,
            release_date: {
                date: new Date(s.releaseDate).toLocaleDateString("en-US")
            },
            developers: [s.softwareDeveloper, s.softwarePublisher],
            name: s.title,
            controller_support: 'full',
            supported_languages: null,
            about_the_game: s.description
        }))
        electronConnector
            .nintendoData(s.url)
            .then((nd) => {
                setGame((g) => ({...g, ...nd}))
                setTemp([])
                searchRef.current.value = ''
                searchRef.current.blur()
                setLoading(false)
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
                   _ref={searchRef}
                   onChange={({value: q}) => {
                       electronConnector.nintendoSearch(q).then(setTemp)
                   }}
                   children={<ul className={styles.search}>
                       {temp.map(s => (
                           <li key={s.nsuid} onClick={() => {
                               getSwitchData(s)
                           }}>
                               <img src={s.image} alt={s.title}/>
                               <span>{s.title}</span>
                           </li>)
                       )}
                   </ul>}
                   name='search'/>
            <Input label='Path'
                   value={game.path}
                   disabled={true}
                   name='path'>
                <button onClick={() => getGamePath()}>Get Path</button>
            </Input>
            <Input label='NSP path'
                   value={game.exeArgs?.path}
                   disabled={true}
                   name='path'>
                <button onClick={() => getExePath()}>Get NSP File</button>
            </Input>
            <div className={styles.argsWrapper}>
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