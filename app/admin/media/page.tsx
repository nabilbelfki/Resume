import React from "react";
import styles from "./Media.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

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

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Media;