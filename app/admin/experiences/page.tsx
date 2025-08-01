"use client"
import React from "react";
import styles from "./Experiences.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";

const Experiences: React.FC = () => {
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

    const actions = [
        {
            label: 'Delete Experience',
            action: (IDs:string[]) => console.log(IDs)
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