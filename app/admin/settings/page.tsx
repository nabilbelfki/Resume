import React from "react";
import styles from "./Settings.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

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

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Settings;