"use client";
import React from "react";
import styles from "./Messages.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";
import { useRouter } from "next/navigation";

const Messages: React.FC = () => {
    const router = useRouter();
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
            label: 'Delete Messages',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to delete ${IDs.length > 1 ? 'these messages' : 'this message'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/message/${id}`, {
                                method: 'DELETE',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete messages');
                                }

                                location.href = '/admin/messages';
                            })
                        )
                    );

                    console.log(`${IDs.length} message(s) deleted successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deleting messages:', err);
                    alert(`Failed to delete some messages. Please try again.`);
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