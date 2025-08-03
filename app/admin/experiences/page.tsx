"use client"
import React from "react";
import styles from "./Experiences.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";
import { useRouter } from "next/navigation";

const Experiences: React.FC = () => {
    const router = useRouter();
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Experiences',
            href: '/admin/experiences'
        },
        {
            label: 'All Experiences',
            href: '/admin/experiences'
        }
    ];

    const actions: Action[] = [
        {
            label: 'Delete Experiences',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to delete ${IDs.length > 1 ? 'these experiences' : 'this experience'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/experiences/${id}`, {
                                method: 'DELETE',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete experiences');
                                }

                                location.href = '/admin/experiences';
                            })
                        )
                    );

                    console.log(`${IDs.length} experience(s) deleted successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deleting experiences:', err);
                    alert(`Failed to delete some experiences. Please try again.`);
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
                entity="Experience"
                columns={[
                    { 
                        label: 'Logo', 
                        selectors: [['logo', 'closed', 'path'], ['logo', 'closed', 'name']],
                        type: 'thumbnail',
                        alignment: 'center',
                        thumbnailBackgroundColor: [['image', 'backgroundColor']],
                    }, 
                    { 
                        label: 'Name', 
                        selectors: [['name']], 
                        flex: 3
                    }, 
                    { 
                        label: 'Title', 
                        selectors: [ ['title'] ],
                        flex: 3,
                    },
                    { 
                        label: 'Type', 
                        selectors: [['type']],
                        alignment: 'center',
                        formatter: (text) => text[0].toUpperCase() + text.slice(1)
                    },
                    { 
                        label:'Start', 
                        selectors: [['period', 'start']],
                        alignment: 'center',
                        type: 'date'
                    },
                    { 
                        label:'End', 
                        selectors: [['period', 'end']],
                        alignment: 'center',
                        type: 'date'
                    }
                ]}
            />
        </div>
    );
}

export default Experiences;