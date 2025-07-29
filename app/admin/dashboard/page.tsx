import React from "react";
import styles from "./Dashboard.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

const Dashboard: React.FC = () => {
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Dashboard',
            href: '/admin/dashboard'
        },
        {
            label: 'Home',
            href: '/admin/dashboard'
        }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Dashboard;