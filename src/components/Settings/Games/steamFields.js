import Input from "../../Input";
import electronConnector from "../../../helpers/electronConnector";
import styles from "../settings.module.scss";
import SteamData from "./SteamData";
import {getFromStorage} from "../../../helpers/getFromStorage";
import {currentLang} from "../../../helpers/locales";

const SteamFields = ({game, onChange, setGame , setLoading}) => {
    const args = game.exeArgs || {};
    const {steam_api_key} = getFromStorage('config').settings;

    const getExePath = (key) => {
        electronConnector.getFile().then(achPath => {
            setGame(g => ({...g, [key]: achPath}))
        })
    }

    const getAchievements = () => {
        const {steamId} = game;
        if (steamId && steam_api_key) {
            setLoading(true)
            electronConnector
                .getSteamAchievements({appID: steamId, apiKey: steam_api_key, lang: currentLang(), id: game.id})
                .then((achievements) => {
                    setGame(g => ({...g, achievements}))
                    setLoading(false)
                })
        }

    }

    return (
        <>
            <SteamData game={game} setGame={setGame}/>
            <Input label='Achievements file path'
                   value={game.achPath}
                   onChange={onChange}
                   name='achPath'>
                <button onClick={() => getExePath('achPath')}>Get Achievements Path</button>
            </Input>
            <Input label='Exe file path'
                   value={game.exePath}
                   onChange={onChange}
                   name='exePath'>
                <button onClick={() => getExePath('exePath')}>Get EXE Path</button>
            </Input>
            {(steam_api_key && game.steamId) && <button onClick={getAchievements}>Get achievements</button>}
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