"use client";
import React from "react";
import styles from "./Posts.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";
import { useRouter } from "next/navigation";

const Posts: React.FC = () => {
    const router = useRouter();
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

    const actions = [
        {
            label: 'Delete Posts',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to delete ${IDs.length > 1 ? 'these posts' : 'this post'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/posts/${id}`, {
                                method: 'DELETE',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete posts');
                                }

                                location.href = '/admin/posts';
                            })
                        )
                    );

                    console.log(`${IDs.length} posts deleted successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deleting posts:', err);
                    alert(`Failed to delete some posts. Please try again.`);
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
                entity="Post"
                columns={[
                    { 
                        label:'Name', 
                        selectors: [['title']],
                        flex: 2
                    }, 
                    { 
                        label: 'Name', 
                        selectors: [['author','firstName'], ['author','lastName']], 
                        type: 'avatar', 
                        avatar: 'image',
                        flex: 3
                    }, 
                    { 
                        label: 'Category', 
                        selectors: [['category']], 
                        formatter: (text) => text.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
                    }, 
                    { 
                        label:'Status', 
                        selectors: [['status']], 
                        type: 'status',
                        alignment: 'center',
                        colors: [
                            {
                                key: 'Published',
                                color: '#4D7F3D'
                            },
                            {
                                key: 'Scheduled',
                                color: '#497690'
                            },
                            {
                                key: 'Draft',
                                color: '#BAB63C'
                            }
                        ]
                    }, 
                    { 
                        label:'Date', 
                        selectors: [['date']],
                        alignment: 'center',
                        sort: true,
                        type: 'date'
                    }
                ]}
            />
        </div>
    );
}

export default Posts;