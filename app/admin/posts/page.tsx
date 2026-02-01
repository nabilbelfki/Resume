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

    const actions: Action[] = [
        {
            label: 'Activate Posts',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to activate ${IDs.length > 1 ? 'these posts' : 'this post'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/posts/${id}/activate`, {
                                method: 'PATCH',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to activate posts');
                                }

                                location.href = '/admin/posts';
                            })
                        )
                    );

                    console.log(`${IDs.length} post(s) activated successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error activating posts:', err);
                    alert(`Failed to activate some posts. Please try again.`);
                }
            }
        },
        {
            label: 'Archive Posts',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to archive ${IDs.length > 1 ? 'these posts' : 'this post'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/posts/${id}/archive`, {
                                method: 'PATCH',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to archive posts');
                                }

                                location.href = '/admin/posts';
                            })
                        )
                    );

                    console.log(`${IDs.length} post(s) archived successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error archiving posts:', err);
                    alert(`Failed to archive some posts. Please try again.`);
                }
            }
        },
        {
            label: 'Deactivate Posts',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to deactivate ${IDs.length > 1 ? 'these posts' : 'this post'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/posts/${id}/deactivate`, {
                                method: 'PATCH',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to deactivate posts');
                                }

                                location.href = '/admin/posts';
                            })
                        )
                    );

                    console.log(`${IDs.length} post(s) deactivated successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deactivating posts:', err);
                    alert(`Failed to deactivate some posts. Please try again.`);
                }
            }
        },
        {
            label: 'Delete Posts',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to delete ${IDs.length > 1 ? 'these posts' : 'this post'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    await Promise.all(
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
        },
        {
            label: 'Publish Posts',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to publish ${IDs.length > 1 ? 'these posts' : 'this post'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/posts/${id}/publish`, {
                                method: 'PATCH',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to publish posts');
                                }

                                location.href = '/admin/posts';
                            })
                        )
                    );

                    console.log(`${IDs.length} post(s) published successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error publishing posts:', err);
                    alert(`Failed to publish some posts. Please try again.`);
                }
            }
        },
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
                        label: 'Thumbnail', 
                        selectors: [['thumbnail']],
                        type: 'thumbnail',
                        alignment: 'center',
                        sortable: false,
                        maxWidth: '100px'
                    }, 
                    { 
                        label:'Name', 
                        selectors: [['title']],
                        type: 'visibility',
                        visibility: ['visibility'],
                        flex: 2
                    }, 
                    { 
                        label: 'Author', 
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
                                key: 'Archived',
                                color: '#BF8C00'
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