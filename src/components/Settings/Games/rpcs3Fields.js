import styles from "../settings.module.scss";
import Input from "../../Input";
import {useEffect, useRef, useState} from "react";
import electronConnector from "../../../helpers/electronConnector";
import {getFromStorage} from "../../../helpers/getFromStorage";

const Rpcs3Fields = ({setGame, game, getGamePath}) => {
    const {settings} = getFromStorage('config');
    const [data, setData] = useState([]);
    const [temp, setTemp] = useState([]);
    const searchRef = useRef(null);
    const update = (e) => {
        setGame(a => {
            if (!a.exeArgs) {
                a.exeArgs = {}
            }
            a.exeArgs[e.name] = e.value
            return {...a}
        })
    }

    useEffect(() => {
        electronConnector.getGamesRPCS3({
            path: settings.rpcs3
        }).then(setData)
    }, []);

    const fields = [{
        name: 'gui',
        type: 'select',
        value: game.exeArgs?.gui,
        options: ['--no-gui'],
        onChange: update,
        label: 'Gui',
    }, {
        name: 'rpcs_gameid',
        type: 'text',
        value: game.exeArgs?.rpcs_gameid ? game.exeArgs?.rpcs_gameid.replace('%RPCS3_GAMEID%:', '') : '',
        onChange: ({value, name}) => {
            update({
                name,
                value: '%RPCS3_GAMEID%:' + value
            })
        },
        label: 'Game ID',
    }]

    return (
        <>
            <Input label='Search'
                   _ref={searchRef}
                   onChange={({value: q}) => {
                       if (q.length > 0) {
                           const res = data.filter(({name}) =>
                               name.trim().toLowerCase().includes(q.trim().toLowerCase())
                           )
                           setTemp(res)
                       } else {
                           setTemp([])
                       }
                   }}
                   children={<ul className={styles.search}>
                       {temp.map(s => (
                           <li key={s.appid} onClick={() => {
                               setGame((g) => ({
                                   ...g,
                                   achievements: s.achievement.list,
                                   dataPath: s.dataPath,
                                   name: s.name,
                               }))
                               searchRef.current.value = ''
                               searchRef.current.blur()
                               setTemp([])
                           }}>
                               <img src={s.img.header} alt={s.name}/>
                               <span>{s.name}</span>
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
            <div className={styles.argsWrapper}>
                {fields.map(field => (
                    <Input key={field.name} {...field}/>
                ))}
            </div>
        </>
    )
}

export default Rpcs3Fields