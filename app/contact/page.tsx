import ContactForm from "@/components/ContactForm/ContactForm";
import Calendar from "@/components/Calendar/Calendar";
import styles from "./Contact.module.css";
import Image from "next/image";

const ContactPage = async () => {
    let settings = {
        siteMaintenance: false,
        websiteMessaging: true,
        scheduleMeetings: true
    };

    // Fetch Settings
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${API_BASE_URL}/api/settings`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data.data) {
                settings = data.data;
            }
        }
    } catch {
        // silently fallback to defaults
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>

                {/* Top Section */}
                <div className={styles.contactHeader}>
                    <div className={styles.profileWrapper}>
                        <Image
                            src="/images/profile.png"
                            alt="Nabil Belfki"
                            width={225}
                            height={225}
                            className={styles.profileImage}
                        />
                    </div>
                    <div className={styles.heroText}>
                        <h1>Get In Touch With Me</h1>
                        <p>
                            If you want to connect with me just schedule a meeting and let's talk about whatever your heart desires. Or just send me a message too and I usually respond quickly. Don't hesitate to reach out!
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <div className={styles.contactWrapper}>
                        {(settings.websiteMessaging || settings.scheduleMeetings) && (
                            <div className={styles.contactGrid}>
                                {settings.websiteMessaging && (
                                    <div className={styles.contactColumn}>
                                        <ContactForm />
                                    </div>
                                )}
                                {settings.scheduleMeetings && (
                                    <div className={styles.contactColumn}>
                                        <div className={styles.calendarTitle}>Schedule Meeting</div>
                                        <Calendar />
                                    </div>
                                )}
                            </div>
                        )}
                        {!settings.websiteMessaging && !settings.scheduleMeetings && (
                            <div className={styles.disabledState}>
                                <p>Messaging and Scheduling are temporarily disabled.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
