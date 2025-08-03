"use client";
import React from "react";
import styles from "./Skills.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";

const Skills: React.FC = () => {
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Skills',
            href: '/admin/skills'
        },
        {
            label: 'All Skills',
            href: '/admin/skills'
        }
    ];
    const actions = [
        {
            label: 'Delete Skills',
            action: (IDs:string[]) => console.log(IDs)
        }
    ]
    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <Table 
                actions={actions}
                showing={5}
                entity="Skill"
                columns={[
                    { 
                        label: 'Logo', 
                        selectors: [['image', 'url'], ['image', 'name']],
                        type: 'thumbnail',
                        alignment: 'center',
                        thumbnailBackgroundColor: [['image', 'backgroundColor']],
                        sortable: false
                    }, 
                    { 
                        label: 'Name', 
                        selectors: [['name']], 
                        flex: 2
                    }, 
                    { 
                        label: 'Description', 
                        selectors: [ ['description', 'text'] ],
                        flex: 4,
                        maxWidth: "400px"
                    },
                    { 
                        label: 'Type', 
                        selectors: [['type']],
                        alignment: 'center',
                        formatter: (text) => text[0].toUpperCase() + text.slice(1)
                    },
                    { 
                        label:'Created', 
                        selectors: [['created']],
                        alignment: 'center',
                        type: 'date',
                        sort: true
                    }
                ]}
            />
        </div>
    );
}

export default Skills;