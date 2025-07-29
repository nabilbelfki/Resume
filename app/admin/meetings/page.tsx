import React from "react";
import styles from "./Meetings.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

const Meetings: React.FC = () => {
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Meetings',
            href: '/admin/meetings'
        },
        {
            label: 'All Meetings',
            href: '/admin/meetings'
        }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Meetings;