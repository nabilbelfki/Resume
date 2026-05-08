"use client";
import React from "react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm/ContactForm";
import Calendar from "@/components/Calendar/Calendar";
import styles from "../../app/contact/Contact.module.css";

interface DesktopContactPageProps {
  settings: {
    siteMaintenance: boolean;
    websiteMessaging: boolean;
    scheduleMeetings: boolean;
  };
}

const DesktopContactPage: React.FC<DesktopContactPageProps> = ({ settings }) => {
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
            <div className={styles.contactGrid}>
              {settings.websiteMessaging && (
                <div className={styles.contactColumn}>
                  <ContactForm />
                </div>
              )}
              {settings.scheduleMeetings && (
                <div className={styles.contactColumn}>
                  <div className={styles.calendarTitle}>Schedule a Meeting</div>
                  <Calendar />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopContactPage;
