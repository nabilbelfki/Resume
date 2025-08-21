import React from "react";
import styles from "./Dashboard.module.css"
import { Breadcrumb as breadcrumb} from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import NewMessages from "@/components/Widgets/NewMessages/NewMessages";
import ActiveUsers from "@/components/Widgets/ActiveUsers/ActiveUsers";

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
            <div className={styles.dashboard}>
                <NewMessages />
                <ActiveUsers />
            </div>
        </div>
    );
}

export default Dashboard;