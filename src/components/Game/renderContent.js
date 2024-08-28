import styles from "./game.module.scss";

const RenderContent = ({game, lastPlayed, playTime, fields = []}) => {
    const infoData = [...fields,  {
        label: 'Metacritics',
        value: game.metacritic?.score
    }, {
        label: 'Release date',
        value: game.release_date?.date
    }, {
        label: 'Controller support',
        value: game.controller_support
    }, {
        label: 'PEGI rating',
        value: game.required_age
    }, {
        label: 'Developers',
        value: game.developers?.map(a => <span key={a}>{a},</span>)
    }, {
        label: 'Languages',
        value: game.supported_languages ? <span dangerouslySetInnerHTML={{__html: game.supported_languages}}/> : null
    }]


    return (
        <div className={styles.content}>
            <div className={styles.description}>
                <h1>{game.name}</h1>
                {game.about_the_game && <div dangerouslySetInnerHTML={{__html: game.about_the_game}}/>}
                {game.pc_requirements && <div className={styles.requirements}>
                    <div dangerouslySetInnerHTML={{__html: game.pc_requirements.minimum}}/>
                    <div dangerouslySetInnerHTML={{__html: game.pc_requirements.recommended}}/>
                </div>
                }
            </div>
            <div className={styles.info}>
                {game.img_landscape && <img src={game.img_landscape} alt={'landscape'}/>}
                <ul>
                    {infoData.map(({label, value}) => {
                        if (value) {
                            return (
                                <li key={label}>
                                    <strong>{label}:</strong>
                                    {value}
                                </li>
                            )
                        }
                        return null
                    })}
                </ul>
            </div>
        </div>

    )
}

export default RenderContent