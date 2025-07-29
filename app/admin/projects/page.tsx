import React from "react";
import styles from "./Projects.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

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

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Projects;