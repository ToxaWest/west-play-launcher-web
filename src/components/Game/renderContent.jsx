import styles from "./game.module.scss";
import RenderHLTB from "./renderHLTB";

const RenderContent = ({game, fields = []}) => {

    const renderDevelopers = (devs) => {
        if (!devs) {
            return null
        }
        return devs.filter((dev) => dev).join(', ');
    }

    const infoData = [...fields, {
        label: 'Metacritics',
        value: game.metacritic?.score
    }, {
        label: 'Release date',
        value: game.release_date?.date
    }, {
        label: 'Players',
        value: game.players
    }, {
        label: 'PEGI rating',
        value: game.required_age
    }, {
        label: 'Developers',
        value: renderDevelopers(game.developers)
    }, {
        label: 'Languages',
        value: game.supported_languages ? <span dangerouslySetInnerHTML={{__html: game.supported_languages}}/> : null
    }]


    return (
        <div className={styles.content}>
            <div className={styles.description}>
                <h1>{game.name}</h1>
                {game.short_description && <div dangerouslySetInnerHTML={{__html: game.short_description}}/>}
                {game.about_the_game && <div dangerouslySetInnerHTML={{__html: game.about_the_game}}/>}
            </div>
            <div className={styles.info}>
                <ul>
                    {infoData.filter(({value}) => Boolean(value))
                        .map(({label, value}) => (
                            <li key={label}>
                                <strong>{label}:</strong>
                                {value}
                            </li>
                        ))}
                </ul>
                <RenderHLTB game={game} />
            </div>
        </div>

    )
}

export default RenderContent