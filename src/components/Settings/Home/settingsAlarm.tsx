import React from "react";

import electronConnector from "../../../helpers/electronConnector";
import i18n from "../../../helpers/translate";
import Input from "../../Input";

const SettingsAlarm = ({value, onChange}) => {
    const [alarm, getAlarm] = React.useActionState(electronConnector.getAlarmRegionList, [])

    React.useEffect(() => {
        React.startTransition(getAlarm)
    }, [])

    return (
        <Input
            label={i18n.t('UA alarm region')}
            type="select"
            name="uaAlarmId"
            options={alarm}
            value={value}
            onChange={onChange}
        />
    )
}

export default SettingsAlarm