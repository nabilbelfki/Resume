"use client";
import React from "react";
import styles from "./Projects.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";

const Projects: React.FC = () => {
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Projects',
            href: '/admin/projects'
        },
        {
            label: 'All Projects',
            href: '/admin/projects'
        }
    ];

    const actions = [
        {
            label: 'Delete Projects',
            action: (IDs:string[]) => console.log(IDs)
        }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <Table 
                actions={actions}
                showing={5}
                entity="Project"
                columns={[
                    { 
                        label: 'Logo', 
                        selectors: [['thumbnail', 'path'], ['thumbnail', 'fileName']],
                        type: 'thumbnail',
                        alignment: 'center',
                        thumbnailBackgroundColor: [['thumbnail', 'backgroundColor']],
                    }, 
                    { 
                        label: 'Name', 
                        selectors: [['name']], 
                        flex: 3
                    }, 
                    { 
                        label: 'URL', 
                        selectors: [ ['url'] ],
                        flex: 3,
                    },
                    { 
                        label: 'Views', 
                        selectors: [['views']],
                        alignment: 'center'
                    },
                    { 
                        label:'Duration', 
                        selectors: [['duration']],
                        alignment: 'center',
                        type: 'date'
                    },
                    { 
                        label:'Created', 
                        selectors: [['startDate']],
                        alignment: 'center',
                        type: 'date'
                    }
                ]}
            />
        </div>
    );
}

export default Projects;