import Input from "../Input";
import electronConnector from "../../helpers/electronConnector";
import styles from "./settings.module.scss";
import {useState} from "react";

const RyujinxFields = ({setGame, game}) => {
    const [temp, setTemp] = useState([]);

    const regExp = new RegExp(/https:\/\/www.nintendo.com\/sg\/switch\/(.*)\/index.html/);

    const getSwitchData = (id) => {
        electronConnector.nintendoReq({id}).then(({detail}) => {
            const {releaseDate, common} = detail;
            setGame((g) => ({
                ...g,
                color: `rgba(${common.colorR}, ${common.colorG}, ${common.colorB}, .6)`,
                nsuid: common.nsuid,
                release_date: {
                    date: new Date(releaseDate).toLocaleDateString("en-US")
                },
                name: common.title,
                supported_languages: common.supportedLanguage.join(', '),
                developers: [common.developerName, common.publisherName],
                controller_support: 'full',
                required_age: common.esrb
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
                       const params = new URLSearchParams({q, limit: 24, opt_type: 2}).toString();
                       electronConnector.nintendoSearch({params}).then(e => {
                           const items = e.result.items.filter(a => regExp.test(a.url))
                           setTemp(() => items)
                       })
                   }}
                   children={<ul className={styles.search}>
                       {temp.map(s => (
                           <li key={s.id} onClick={() => {
                               const [, key] = regExp.exec(s.url)
                               getSwitchData(key)
                           }}>
                               <img src={s.iurl} alt={s.title}/>
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
                           name={field.name}>
                    </Input>
                ))}
            </div>
        </>
    )
}

export default RyujinxFields;