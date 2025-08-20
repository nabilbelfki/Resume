"use client";
import React from "react";
import styles from "./Projects.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";
import { useRouter } from "next/navigation";

const Projects: React.FC = () => {
    const router = useRouter();
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

    const actions: Action[] = [
        {
            label: 'Activate Projects',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to activate ${IDs.length > 1 ? 'these projects' : 'this project'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/projects/${id}/activate`, {
                                method: 'PATCH',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete projects');
                                }

                                location.href = '/admin/projects';
                            })
                        )
                    );

                    console.log(`${IDs.length} project(s) activated successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error activating projects:', err);
                    alert(`Failed to activate some projects. Please try again.`);
                }
            }
        },
        {
            label: 'Deactivate Projects',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to deactivate ${IDs.length > 1 ? 'these projects' : 'this project'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/projects/${id}/deactivate`, {
                                method: 'PATCH',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to deactivate projects');
                                }

                                location.href = '/admin/projects';
                            })
                        )
                    );

                    console.log(`${IDs.length} project(s) deactivated successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deactivating projects:', err);
                    alert(`Failed to deactivate some projects. Please try again.`);
                }
            }
        },
        {
            label: 'Delete Projects',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to delete ${IDs.length > 1 ? 'these projects' : 'this project'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/projects/${id}`, {
                                method: 'DELETE',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete projects');
                                }

                                location.href = '/admin/projects';
                            })
                        )
                    );

                    console.log(`${IDs.length} project(s) deleted successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deleting projects:', err);
                    alert(`Failed to delete some projects. Please try again.`);
                }
            }
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
                        sortable: false,
                        maxWidth: '100px'
                    }, 
                    { 
                        label: 'Name', 
                        selectors: [['name']],
                        type: 'active',
                        active: ['status'],
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
                        type: 'date',
                        sort: true
                    }
                ]}
            />
        </div>
    );
}

export default Projects;