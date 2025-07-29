import React from "react";
import styles from "./Skills.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

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

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Skills;