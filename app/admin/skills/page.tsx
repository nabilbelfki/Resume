"use client";
import React from "react";
import styles from "./Skills.module.css"
import { Breadcrumb as breadcrumb, Action } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Table from "@/components/Table/Table";
import { useRouter } from "next/navigation";

const Skills: React.FC = () => {
    const router = useRouter();
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
    const actions: Action[] = [
        {
            label: 'Activate Skills',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to activate ${IDs.length > 1 ? 'these skills' : 'this skill'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/skills/${id}/activate`, {
                                method: 'PATCH',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete skills');
                                }

                                location.href = '/admin/skills';
                            })
                        )
                    );

                    console.log(`${IDs.length} skill(s) activated successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error activating skills:', err);
                    alert(`Failed to activate some skills. Please try again.`);
                }
            }
        },
        {
            label: 'Deactivate Skills',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to deactivate ${IDs.length > 1 ? 'these skills' : 'this skill'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/skills/${id}/deactivate`, {
                                method: 'PATCH',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to deactivate skills');
                                }

                                location.href = '/admin/skills';
                            })
                        )
                    );

                    console.log(`${IDs.length} skill(s) deactivated successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deactivating skills:', err);
                    alert(`Failed to deactivate some skills. Please try again.`);
                }
            }
        },
        {
            label: 'Delete Skills',
            action: async (IDs:string[]) => {
                if (!confirm(`Are you sure you want to delete ${IDs.length > 1 ? 'these skills' : 'this skill'}?`)) {
                    return;
                }

                try {
                    // Use Promise.all to delete all users in parallel
                    const results = await Promise.all(
                        IDs.map(id => 
                            fetch(`/api/skills/${id}`, {
                                method: 'DELETE',
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete skills');
                                }

                                location.href = '/admin/skills';
                            })
                        )
                    );

                    console.log(`${IDs.length} skill(s) deleted successfully`);
                    router.refresh();
                } catch (err) {
                    console.error('Error deleting skills:', err);
                    alert(`Failed to delete some skills. Please try again.`);
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
                entity="Skill"
                columns={[
                    { 
                        label: 'Logo', 
                        selectors: [['image', 'url'], ['image', 'name']],
                        type: 'thumbnail',
                        alignment: 'center',
                        thumbnailBackgroundColor: [['image', 'backgroundColor']],
                        sortable: false,
                        maxWidth: '100px'
                    }, 
                    { 
                        label: 'Name', 
                        selectors: [['name']], 
                        type: 'active',
                        active: ['status'],
                        flex: 2
                    }, 
                    { 
                        label: 'Description', 
                        selectors: [ ['description', 'text'] ],
                        flex: 7,
                        maxWidth: "50vw"
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