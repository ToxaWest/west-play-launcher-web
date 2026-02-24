import React, {useEffect, useState} from "react";
import type {notificationsType} from "@type/provider.types";

const Notifications = ({notifications}: { notifications: notificationsType }) => {
    const colors = {
        'error': 'rgba(200, 30, 0, 0.85)',   // Darker Red
        'saving': 'rgba(230, 180, 0, 0.85)',  // Darker Yellow
        'success': 'rgba(16, 124, 16, 0.85)', // Dark Green for success/achievement
        'warning': 'rgba(230, 120, 0, 0.85)' // Darker Orange
    }

    const [isVisible, setIsVisible] = useState(false);
    const [displayNotification, setDisplayNotification] = useState<notificationsType | null>(null);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (notifications) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplayNotification(notifications);
            setIsVisible(true);
            setAnimationKey(prevKey => prevKey + 1); // Re-trigger animation

            const audio = new Audio('/assets/sound/xbox-notification.mp3');
            audio.volume = 1;
            audio.play().catch(e => console.error("Audio play failed:", e));

        } else {
            setIsVisible(false);
        }
    }, [notifications]);

    const handleTransitionEnd = () => {
        if (!isVisible) {
            setDisplayNotification(null);
        }
    };

    if (!displayNotification) {
        return null;
    }

    const {img, description, name, status} = displayNotification;

    return (
        <div
            onTransitionEnd={handleTransitionEnd}
            className={`fixed top-10 right-10 z-[100] transition-all duration-300 w-[400px] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12"
            }`}
        >
            <div
                className="flex items-center gap-4 p-3 rounded-lg shadow-2xl text-white backdrop-blur-md"
                style={{backgroundColor: colors[status]}}
            >
                <div key={animationKey} className="relative w-14 h-14 flex items-center justify-center animate-jump-in">
                    {/*The Xbox logo can be a fallback, but the main icon comes from the notification data*/}
                    <img src={img || '/assets/controller/Xbox_Logo.svg'} alt={name} className="relative z-[1] w-10 h-10 object-contain"/>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="font-semibold text-lg leading-tight">
                        {name}
                    </div>
                    {description && <div className="text-sm opacity-90 leading-tight">
                        {description}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Notifications;