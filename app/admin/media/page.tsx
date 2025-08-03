"use client"
import React from "react";
import styles from "./Media.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";
import { useRouter } from "next/navigation";

const Media: React.FC = () => {
    const router = useRouter();
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Media',
            href: '/admin/media'
        },
        {
            label: 'All Media',
            href: '/admin/media'
        }
    ];

    const actions = [
        {
            label: 'Delete Media',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to delete ${IDs.length > 1 ? 'these media files' : 'this media'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/media/${id}`, {
                                method: 'DELETE',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete media');
                                }

                                location.href = '/admin/media';
                            })
                        )
                    );

                    console.log(`${IDs.length} media deleted successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deleting media:', err);
                    alert(`Failed to delete some media. Please try again.`);
                }
            }
        }
    ]

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <Table 
                actions={actions}
                showing={5}
                entity="Media"
                columns={[
                    { 
                        label: 'Thumbnail', 
                        selectors: [['path']],
                        type: 'thumbnail',
                        alignment: 'center',
                        thumbnailBackgroundColor: [['image', 'backgroundColor']],
                    }, 
                    { 
                        label: 'File Name', 
                        selectors: [['fileName']], 
                        flex: 2
                    }, 
                    { 
                        label: 'Description', 
                        selectors: [ ['description'] ],
                        flex: 4,
                        maxWidth: "400px"
                    },
                    { 
                        label: 'File Type', 
                        selectors: [['fileType']],
                        alignment: 'center',
                        
                    },
                    { 
                        label:'Created', 
                        selectors: [['lastModified']],
                        alignment: 'center',
                        type: 'date'
                    }
                ]}
            />
        </div>
    );
}

export default Media;