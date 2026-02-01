"use client";
import React, { useState } from "react";
import styles from "./Settings.module.css"
import { Breadcrumb as breadcrumb } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Radio from "@/components/Radio/Radio";
import { Radio as RadioType} from "@/lib/types";
import Toggle from "@/components/Toggle/Toggle";

type SettingsType = {
    userRegistration: boolean,
    siteMaintenance: boolean,
    websiteMessaging: boolean,
    scheduleMeetings: boolean
}

const Settings: React.FC = () => {
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Settings',
            href: '/admin/settings'
        },
        {
            label: 'All Settings',
            href: '/admin/settings'
        }
    ];

    const appearanceRadios: RadioType[] = [
        {
            ID: "light-mode",
            label: "Light Mode",
            value: "light-mode"
        },
        {
            ID: "dark-mode",
            label: "Dark Mode",
            value: "dark-mode"
        },
        {
            ID: "system-default",
            label: "System Default",
            value: "system-default"
        }
    ];

    const [appearance, setAppearance] = useState('system-default');

    const [settings, setSettings] = useState<SettingsType>({
        userRegistration: false,
        siteMaintenance: false,
        websiteMessaging: false,
        scheduleMeetings: false
    });

    const setSetting = (key: string, value: boolean) => {
        setSettings(prev => ({
          ...prev,  
          [key]: value,
        }))
    }

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <div className={styles.actions}>
                <button 
                className={styles.back} 
                onClick={() => window.location.href = '/admin/dashboard'}
                >
                <svg style={{rotate: '180deg'}} xmlns="http://www.w3.org/2000/svg" version="1.0" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="var(--form-back-button-icon)" stroke="none">
                    <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
                    </g>
                </svg>
                <span>Back</span>
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles.setting}>
                    <label htmlFor="apperance">Appearance</label>
                    <p>Here choose your preference between Light Mode, Dark Mode or System Preference. If System Default is chosen then light/dark mode will be toggled depending on the relevant time of day.</p>
                    <Radio 
                        name="appearance" 
                        radios={appearanceRadios}
                        value={appearance}
                        select={setAppearance}
                    />
                </div>
                <div className={styles.setting}>
                    <label htmlFor="user-registration">User Registration</label>
                    <p>This disables the registration page and ability to create new users. Enable this in the event where bots are constantly trying to create new users in your admin portal. In the event that this occurs, consider using ReCaptcha to mitigate this spam.</p>
                    <Toggle value={settings.userRegistration} identifier="userRegistration" toggle={setSetting} />
                </div>
                <div className={styles.setting}>
                    <label htmlFor="site-maintenance">Site Under Maintenance</label>
                    <p>In certain cases, you may be working on the website and not want your users to see changes being made. Or something may have gone wrong and you need some time. Regardless of the situation by toggling this on your users will see a maintenance page so that you can make changes while your site is live.</p>
                    <Toggle value={settings.siteMaintenance} identifier="siteMaintenance" toggle={setSetting} />
                </div>
                <div className={styles.setting}>
                    <label htmlFor="site-maintenance">Website Messaging</label>
                    <p>This can help combat against spamming from bots. Use the toggle to disable/enable messaging on the website.</p>
                    <Toggle value={settings.websiteMessaging} identifier="websiteMessaging" toggle={setSetting} />
                </div>
                <div className={styles.setting}>
                    <label htmlFor="site-maintenance">Scheduling Meetings</label>
                    <p>This disables the ability to schedule meetings. This could be used in the case on meeting spam, or to temporarily disable meetings due to vacation or some other reason.</p>
                    <Toggle value={settings.scheduleMeetings} identifier="scheduleMeetings" toggle={setSetting} />
                </div>
                <div className={styles.setting}>
                    <label htmlFor="site-maintenance">Cache</label>
                    <p>All endpoints are cached for quicker response times. In the event of not seeing new resources, it could be because the cached result is showing. Click below to clear the entire cache.</p>
                    <button className={styles.cacheButton}>Clear Cache</button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
