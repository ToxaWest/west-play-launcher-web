import {useState} from "react";
import AddImage from "./addImage";
import formatBytes from "../../helpers/formatBytes";

const Input = ({label, value, name, onChange, children}) => <label>
    <span>{label || name}</span>
    <input type="text"
           placeholder={label}
           name={name}
           defaultValue={value}
           onChange={onChange}
    />
    {children}
</label>

const AddGame = ({data, submit}) => {
    const [game, setGame] = useState(data);

    const onChange = (e) => {
        setGame(g => {
            return {
                ...g,
                [e.target.name]: e.target.value
            }
        })
    }

    const getSteamData = () => {
        window.electronAPI.getSteamData(game.steamId).then((r) => {
            const {
                about_the_game,
                name,
                release_date,
                pc_requirements,
                developers,
                controller_support,
                required_age,
                metacritic,
                header_image,
                supported_languages,
            } = r[game.steamId].data;

            setGame(g => {
                return {
                    ...g,
                    supported_languages,
                    img_landscape: header_image,
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

        })
    }

    const getGamePath = () => {
        window.electronAPI.getFolder().then(r => {
            console.log(r);
            setGame(g => {
                return {
                    ...g,
                    path: r.path,
                    size:formatBytes(r.size)
                }
            })
        })
    }

    const getExePath = () => {
        window.electronAPI.getFile().then(exePath => {
            setGame(g => {
                return {
                    ...g,
                    exePath
                }
            })
        })
    }

    return (
        <details>
            <summary>
                {game.name}
            </summary>
            <div>
                <Input label='Name'
                       value={game.name}
                       onChange={onChange}
                       name='name'/>
                <Input label={'SteamId'} value={game.steamId} name={'steamId'} onChange={onChange}/>
                {game.steamId && <button onClick={() => getSteamData()}>Get data from Steam</button>}
                <Input label='steamgriddb id'
                       value={game.steamgriddb}
                       onChange={onChange}
                       name='steamgriddb'/>
                <Input label='Path'
                       value={game.path}
                       onChange={onChange}
                       name='path'>
                    <button onClick={() => getGamePath()}>Get Path</button>
                </Input>
                <Input label='Exe file path'
                       value={game.exePath}
                       onChange={onChange}
                       name='exePath'>
                    <button onClick={() => getExePath()}>Get EXE Path</button>
                </Input>
                <Input label='Arguments'
                       value={game.exeArgs}
                       onChange={onChange}
                       name='exeArgs'/>
                {game.steamgriddb && <>
                    <AddImage id={game.steamgriddb} type="grid" onChange={onChange} value={game.img_grid}/>
                    <AddImage id={game.steamgriddb} type="landscape" onChange={onChange} value={game.img_landscape}/>
                    <AddImage id={game.steamgriddb} type="hero" onChange={onChange} value={game.img_hero}/>
                    <AddImage id={game.steamgriddb} type="logo" onChange={onChange} value={game.img_logo}/>
                    <AddImage id={game.steamgriddb} type="icon" onChange={onChange} value={game.img_icon}/>
                </>}

                <button onClick={(e) => {
                    e.target.parentNode.parentNode.open = false
                    submit(game)
                }}>
                    submit
                </button>
            </div>
        </details>
    )
}

export default AddGame;