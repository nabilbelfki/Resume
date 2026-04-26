"use client";
import React, { useEffect, useState } from "react";
import styles from "./ResumePage.module.css";
import NavigationBar from "@/components/NavigationBar/NavigationBar";

export default function ResumePage() {
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResumeUrl = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.data?.resumeUrl) {
                        setResumeUrl(data.data.resumeUrl);
                    }
                }
            } catch (err) {
                console.error("Failed to load global resume binding", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResumeUrl();
    }, []);

    return (
        <div className={styles.container}>
            <NavigationBar type="classic" />

            <div className={styles.resumeWrapper}>
                {loading ? (
                    <h2>Loading Resume Constraints...</h2>
                ) : resumeUrl ? (
                    <object
                        data={resumeUrl}
                        type="application/pdf"
                        className={styles.pdfFrame}
                    >
                        <div className={styles.errorState}>
                            <p>It appears your browser natively blocks inline PDF viewing.</p>
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>
                                Download PDF Resume Securely
                            </a>
                        </div>
                    </object>
                ) : (
                    <div className={styles.errorState}>
                        <h2>No Resume found.</h2>
                        <p>The administrator has not configured a master global resume URL yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
