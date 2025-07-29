import React from "react";
import styles from "./Posts.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

const Posts: React.FC = () => {
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Posts',
            href: '/admin/posts'
        },
        {
            label: 'All Posts',
            href: '/admin/posts'
        }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
        </div>
    );
}

export default Posts;