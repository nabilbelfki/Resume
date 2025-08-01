"use client"
import React from "react";
import styles from "./Meetings.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";
import { formatTime } from "@/lib/utilities";

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
                entity="Meeting"
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
                        label: 'Notes', 
                        selectors: [['notes']],
                        flex: 3
                    }, 
                    { 
                        label: 'Time', 
                        selectors: [['dateTime']],
                        alignment: 'center',
                        formatter: (text) => formatTime(text.split("T")[1].split(".")[0])
                    }, 
                    { 
                        label:'Date', 
                        selectors: [['dateTime']],
                        alignment: 'center',
                        type: 'date'
                    }
                ]}
            />
        </div>
    );
}

export default Meetings;