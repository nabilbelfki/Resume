import React from "react";
import styles from "./PendingUsers.module.css";
import { stringToHexColor, isColorTooDark } from "@/lib/color";

const users = [
    {
        firstName: 'Zoubair',
        lastName: 'Abiri'
    },
    {
        firstName: 'Robert',
        lastName: 'Shail'
    },
    {
        firstName: 'Antionette',
        lastName: 'Lyon'
    }
];

const PendingUsers: React.FC = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Pending Users</h2>
            <div className={styles.users}>
                {users.map((user, index) => {
                    const name = `${user.firstName} ${user.lastName}`;
                    const initials = `${user.firstName[0]}${user.lastName[0]}`;
                    const backgroundColor = stringToHexColor(name);
                    const color = isColorTooDark(backgroundColor) ? '#FFFFFF' : '#4C4C4C';
                    
                    // Create unique IDs for each SVG gradient using the index
                    const acceptGradientId = `accept-gradient-${index}`;
                    const declineGradientId = `decline-gradient-${index}`;

                    return (
                        <div key={`user-${index}`} className={styles.user}>
                            <div className={styles.initials} style={{ backgroundColor, color }}>{initials}</div>
                            <div className={styles.name}>{name}</div>
                            <div className={styles.actions}>
                                <div className={styles.accept}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 0 3 2" fill="none">
                                        <path d="M2.20601 0.0585542C2.2841 -0.0195324 2.41013 -0.0195037 2.48823 0.0585542L2.55952 0.128867C2.63758 0.206974 2.63761 0.33398 2.55952 0.41207L1.22456 1.74605C1.18418 1.78644 1.131 1.80505 1.07808 1.80367C1.0255 1.80477 0.97269 1.78617 0.93257 1.74605L0.0585466 0.872031C-0.0195369 0.793947 -0.0194942 0.667914 0.0585466 0.589804L0.128859 0.518515C0.206966 0.440436 0.333966 0.440419 0.412062 0.518515L1.07808 1.18453L2.20601 0.0585542Z" fill={`url(#${acceptGradientId})`}/>
                                        <defs>
                                            <linearGradient id={acceptGradientId} x1="0" y1="0.901871" x2="2.61808" y2="0.901871" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#37BD33"/>
                                                <stop offset="0.75" stopColor="#33BC2F"/>
                                                <stop offset="1" stopColor="#258E22"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className={styles.decline}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 0 2 2" fill="none">
                                        <path d="M1.48538 0.0731532C1.58291 -0.0243844 1.7415 -0.0243844 1.83904 0.0731532L1.92685 0.16096C2.02438 0.258497 2.02438 0.417087 1.92685 0.514625L1.44147 1L1.92685 1.48538C2.02438 1.58291 2.02438 1.7415 1.92685 1.83904L1.83904 1.92685C1.7415 2.02438 1.58291 2.02438 1.48538 1.92685L1 1.44147L0.514625 1.92685C0.417087 2.02438 0.258497 2.02438 0.16096 1.92685L0.0731532 1.83904C-0.0243844 1.7415 -0.0243844 1.58291 0.0731532 1.48538L0.558528 1L0.0731532 0.514625C-0.0243844 0.417087 -0.0243844 0.258497 0.0731532 0.16096L0.16096 0.0731532C0.258497 -0.0243844 0.417087 -0.0243844 0.514625 0.0731532L1 0.558528L1.48538 0.0731532Z" fill={`url(#${declineGradientId})`} fill-opacity="0.7"/>
                                        <defs>
                                            <linearGradient id={declineGradientId} x1="0" y1="1" x2="2" y2="1" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#F14245"/>
                                                <stop offset="0.75" stopColor="#C72A2D"/>
                                                <stop offset="1" stopColor="#A71B1E"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PendingUsers;