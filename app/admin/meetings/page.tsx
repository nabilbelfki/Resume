"use client"
import React from "react";
import styles from "./Meetings.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";
import { formatTime } from "@/lib/utilities";
import { useRouter } from "next/navigation";

const Meetings: React.FC = () => {
    const router = useRouter();
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
            label: 'Cancel Meetings',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to cancel ${IDs.length > 1 ? 'these meetings' : 'this meeting'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/meetings/${id}`, {
                                method: 'DELETE',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete meetings');
                                }

                                location.href = '/admin/meetings';
                            })
                        )
                    );

                    console.log(`${IDs.length} meeting(s) deleted successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deleting meetings:', err);
                    alert(`Failed to delete some meetings. Please try again.`);
                }
            }
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
                        formatter: (text) => formatTime(text.split("T")[1].split(".")[0]),
                        sortKey: 'time'
                    }, 
                    { 
                        label:'Date', 
                        selectors: [['dateTime']],
                        alignment: 'center',
                        type: 'date',
                        sort: true
                    }
                ]}
            />
        </div>
    );
}

export default Meetings;