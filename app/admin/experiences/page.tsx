import React from "react";
import styles from "./Experiences.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

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

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Experiences;