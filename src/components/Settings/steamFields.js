import Input from "../Input";
import electronConnector from "../../helpers/electronConnector";
import styles from "./settings.module.scss";
import {useState} from "react";

const SteamFields = ({game, onChange, setGame}) => {
    const [temp, setTemp] = useState([]);

    const args = game.exeArgs || {};

    const getSteamData = (steamId) => {
        electronConnector.getSteamData(steamId).then((r) => {
            const {
                about_the_game,
                name,
                release_date,
                pc_requirements,
                developers,
                controller_support,
                required_age,
                metacritic,
                supported_languages,
            } = r[steamId].data;

            setGame(g => {
                return {
                    ...g,
                    steamId,
                    supported_languages,
                    about_the_game,
                    name,
                    release_date,
                    pc_requirements,
                    developers,
                    metacritic,
                    controller_support,
                    required_age
                }
            })
            setTemp([])
        })
    }

    return (
        <>
            <Input label='Search'
                   onChange={({value: params}) => {
                       electronConnector.steamSearch({params}).then(setTemp)
                   }}
                   children={<ul className={styles.search}>
                       {temp.map(s => (
                           <li key={s.appid} onClick={() => {
                               getSteamData(s.appid)
                           }}>
                               <img src={s.logo} alt={s.name}/>
                               <span>{s.name}</span>
                           </li>)
                       )}
                   </ul>}
                   name='search'/>
            <div className={styles.argsWrapper}>
                <button onClick={() => {
                    onChange({
                        name: 'exeArgs',
                        value: {...args, [(parseInt(Object.keys(args).at(-1)) || 0) + 1]: ''}
                    })
                }}>Add starting argument
                </button>
                {Object.entries(args).map(([id, value], index) => (
                    <Input label={'Argument ' + (index + 1)}
                           value={value}
                           key={id}
                           onChange={({value, name}) => {
                               onChange({
                                   name: 'exeArgs',
                                   value: {...args, [name]: value}
                               })
                           }}
                           name={id}>
                        <button
                            onClick={() => {
                                delete args[id];
                                onChange({
                                    name: 'exeArgs',
                                    value: {...args}
                                })
                            }}>Remove argument
                        </button>
                    </Input>
                ))}
            </div>
        </>
    )
}

export default SteamFields;