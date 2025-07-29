import React from "react";
import styles from "./Messages.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

const Messages: React.FC = () => {
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Messages',
            href: '/admin/messages'
        },
        {
            label: 'All Messages',
            href: '/admin/messages'
        }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Messages;