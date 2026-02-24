import React from "react";

import electronConnector from "../../helpers/electronConnector";

const Alarm = () => {
    const [alarm, getAlarm] = React.useActionState<any>(electronConnector.getAlarm, [])

    React.useEffect(() => {
        React.startTransition(getAlarm)
        const interval = setInterval(() => {
            React.startTransition(getAlarm)
        }, 1000 * 60)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const imgMapping = {
        AIR: 'https://map.ukrainealarm.com/images/content/icon_air.svg',
        ARTILLERY: 'https://map.ukrainealarm.com/images/content/icon_artillery.svg',
        URBAN_FIGHTS: 'https://map.ukrainealarm.com/images/content/icon_street.svg'
    }

    const activeAlarm = alarm.filter(({isContinue}) => isContinue)
    if (!activeAlarm.length) return null

    return (
        <div className="flex items-center gap-gap-half">
            {activeAlarm.map(({regionEngName, alertType}) => (
                <img
                    alt={alertType}
                    height="30px"
                    key={alertType + regionEngName}
                    src={imgMapping[alertType]}
                    title={regionEngName}
                    className="h-7.5"
                />
            ))}
        </div>
    )
}

export default Alarm