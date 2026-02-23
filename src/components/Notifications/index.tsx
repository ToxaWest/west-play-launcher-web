import React from "react";
import type {notificationsType} from "@type/provider.types";

const Notifications = ({notifications}: { notifications: notificationsType }) => {
    const colors = {
        'error': 'rgba(240,62,31,0.9)',
        'saving': 'rgba(255,199,4,0.9)',
        'success': 'rgba(127,187,0,0.9)',
        'warning': 'rgba(246,140,0,0.9)'
    }

    if (!notifications) {
        return null
    }

    const {img, description, name, status} = notifications;

    return (
        <div className="fixed top-gap right-gap z-[100] transition-all duration-300">
            <div className="flex gap-gap p-gap rounded-theme shadow-lg text-white" style={{ backgroundColor: colors[status] }}>
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <img src={'/assets/controller/Xbox_Logo.svg'} alt={name} className="absolute inset-0 w-full h-full opacity-20"/>
                    <img src={img} alt={name} className="relative z-[1] w-8 h-8 object-contain"/>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="font-bold text-[18px]">
                        {name}
                    </div>
                    {description && <div className="text-[14px] opacity-90">
                        {description}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Notifications;