"use client"
import React from "react";
import styles from "./Users.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Table from "@/components/Table/Table"

const Users: React.FC = () => {

    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Users',
            href: '/admin/users'
        },
        {
            label: 'All Users',
            href: '/admin/users'
        }
    ];

    const actions: Action[] = [
        {
            label: 'Accept Users',
            action: () => console.log('Accept Users')
        },
        {
            label: 'Delete Users',
            action: () => console.log('Delete Users')
        },
        {
            label: 'Decline Users',
            action: () => console.log('Decline Users')
        },
        {
            label: 'Reset Password',
            action: () => console.log('Reset Password')
        },
        {
            label: 'Deactivate Users',
            action: () => console.log('Deactivate Users')
        },
        {
            label: 'Activate Users',
            action: () => console.log('Activate Users')
        },
    ];
    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <Table 
                actions={actions}
                placeholder="Search Users..."
                button={'Create User'}      
                headers={['Name', 'Email', 'Role', 'Status', 'Created']}
                rows={[
                    ['Nabil Belfki', 'nabilbelfki@gmail.com', 'Administrator', 'Accepted', '07/26/2025'],
                    ['Layla Belfki', 'laylabelfki@gmail.com', 'Author', 'Accepted', '08/03/2025'],
                    ['Kristallia Belfki', 'liabelfki@gmail.com', 'Administrator', 'Disabled', '08/07/2025'],
                    ['Abderrazzak Belfki', 'zakbelfki@gmail.com', '', 'Declined', '08/13/2025'],
                    ['Gerasimos Antonatos', 'gerasimosantonatos@gmail.com', '', 'Pending', '08/16/2025'],
                    ['Ismail Aboudihaj', 'ismailaboudihaj@gmail.com', 'Administrator', 'Accepted', '07/26/2025']
                ]}
            />
        </div>
    );
}

export default Users;