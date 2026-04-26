"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Resume.module.css";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export default function AdminResume() {
    const breadcrumbs: Breadcrumb[] = [
        {
            label: 'Resume',
            href: '/admin/resume'
        },
        {
            label: 'Resume',
            href: '/admin/resume'
        }
    ];

    const [activeResumeUrl, setActiveResumeUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                if (data.data?.resumeUrl) {
                    setActiveResumeUrl(data.data.resumeUrl);
                }
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    }

    const triggerUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', 'resume');

        try {
            // 1. Upload to Native Media ecosystem
            const uploadRes = await fetch('/api/media', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Failed to upload file');

            const mediaData = await uploadRes.json();
            const newUrl = mediaData.url;

            // 2. Map url securely into Settings document
            const settingsRes = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeUrl: newUrl })
            });

            if (!settingsRes.ok) throw new Error('Failed to lock settings map');

            setActiveResumeUrl(newUrl);
        } catch (err: any) {
            console.error("Upload workflow collapsed:", err);
            alert(`Failed uploading PDF: ${err.message}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className={styles.content}>
                <input
                    type="file"
                    accept="application/pdf"
                    className={styles.hiddenInput}
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />

                {activeResumeUrl ? (
                    <div className={styles.pdfWrapper} onClick={triggerUpload}>
                        <div className={styles.pdfOverlay} title="Click anywhere to upload a new resume"></div>
                        <object
                            data={activeResumeUrl}
                            type="application/pdf"
                            className={styles.pdfFrame}
                        />
                        {uploading && <div className={styles.loaderOverlay}>Deploying Resume...</div>}
                    </div>
                ) : (
                    <div className={styles.uploadAreaDashed} onClick={triggerUpload}>
                        <div className={styles.uploadIcon}>
                            <svg height="140" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.351 18.1463L1.12737 27.6652C0.404317 28.4114 0 29.4097 0 30.4488V44.0003C0 46.2094 1.79086 48.0003 4 48.0003H44C46.2091 48.0003 48 46.2094 48 44.0003V38.6966C48 37.6299 47.574 36.6074 46.8165 35.8563L38.5943 27.7028C37.2525 26.3723 35.1626 26.1622 33.5828 27.1992L29.546 29.8489C27.7762 31.0107 25.4076 30.5921 24.143 28.8943L16.4317 18.5405C14.9593 16.5636 12.0664 16.376 10.351 18.1463Z" fill="#CACACA" />
                                <rect x="1" y="1" width="46" height="46" rx="3" stroke="#CACACA" strokeWidth="2" />
                                <circle cx="33.2314" cy="14.7704" r="3.69231" fill="#CACACA" />
                            </svg>
                        </div>
                        <p className={styles.uploadText}>Drag or Click</p>

                        {uploading && <div className={styles.loaderOverlay}>Uploading Resume...</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
