"use client";
import React from "react";
import styles from "./Messages.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";

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

    const actions: Action[] = [
        {
            label: 'Activate Users',
            action: (ids) => console.log('Activate Users')
        }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <Table 
                actions={actions}
                showing={5}
                entity="Message"
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
                        label: 'Message', 
                        selectors: [['message']],
                        flex: 3
                    }, 
                    { 
                        label:'Created', 
                        selectors: [['created']],
                        alignment: 'center',
                        type: 'date'
                    }
                ]}
            />
        </div>
    );
}

export default Messages;