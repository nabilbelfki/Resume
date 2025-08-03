"use client"
import React from "react";
import styles from "./Users.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Table from "@/components/Table/Table"
import { useRouter } from "next/navigation";

const Users: React.FC = () => {
    const router = useRouter();
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

    const deleteUsers = async (IDs: string[]) => {    
        if (!confirm(`Are you sure you want to delete ${IDs.length > 1 ? 'these users' : 'this user'}?`)) {
            return;
        }

        try {
            // Use Promise.all to delete all users in parallel
            const results = await Promise.all(
                IDs.map(id => 
                    fetch(`/api/users/${id}`, {
                        method: 'DELETE',
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete user');
                        }

                        location.href = '/admin/users';
                    })
                )
            );

            console.log(`${IDs.length} user(s) deleted successfully`);
            router.refresh();
        } catch (err) {
            console.error('Error deleting users:', err);
            alert(`Failed to delete some users. Please try again.`);
        }
    }

    const actions: Action[] = [
        {
            label: 'Accept Users', // Method: PUT // Endpoint: /api/users/
            action: (ids) => console.log('Accept Users')
        },
        {
            label: 'Delete Users',
            action: deleteUsers
        },
        {
            label: 'Decline Users',
            action: (ids) => console.log('Decline Users')
        },
        {
            label: 'Reset Password',
            action: (ids) => console.log('Reset Password')
        },
        {
            label: 'Deactivate Users',
            action: (ids) => console.log('Deactivate Users')
        },
        {
            label: 'Activate Users',
            action: (ids) => console.log('Activate Users')
        },
    ];
    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <Table 
                actions={actions}
                showing={5}
                entity="User"
                columns={[
                    { 
                        label: 'Name', 
                        selectors: [['firstName'], ['lastName']], 
                        type: 'avatar', 
                        avatar: 'image',
                        flex: 3
                    }, 
                    { 
                        label:'Email', 
                        selectors: [['email']],
                        flex: 2
                    }, 
                    { 
                        label: 'Role', 
                        selectors: [['role']] 
                    }, 
                    { 
                        label:'Status', 
                        selectors: [['status']], 
                        type: 'status',
                        alignment: 'center',
                        colors: [
                            {
                                key: 'Active',
                                color: '#4D7F3D'
                            },
                            {
                                key: 'Deactivated',
                                color: '#D07900'
                            },
                            {
                                key: 'Declined',
                                color: '#B63939'
                            },
                            {
                                key: 'Pending',
                                color: '#BAB63C'
                            },
                        ]
                    }, 
                    { 
                        label:'Created', 
                        selectors: [['created']],
                        alignment: 'center',
                        sort: true,
                        type: 'date'
                    }
                ]}
            />
        </div>
    );
}

export default Users;