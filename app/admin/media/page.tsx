"use client"
import React from "react";
import styles from "./Media.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";

const Media: React.FC = () => {
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
            action: (IDs:string[]) => console.log(IDs)
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