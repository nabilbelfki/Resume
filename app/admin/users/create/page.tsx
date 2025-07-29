"use client"
import React from "react";
import styles from "./User.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Breadcrumb as breadcrumb} from "@/lib/types";

interface Action {
    label: string;
    action: () => void
}

const User: React.FC = () => {

    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Users',
            href: '/admin/users'
        },
        {
            label: 'All Users',
            href: '/admin/users'
        },
        {
            label: 'Create User',
            href: '/admin/users/create'
        }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default User;