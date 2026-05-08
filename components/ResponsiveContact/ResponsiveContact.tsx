"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FullPageTransition from "@/components/FullPageTransition/FullPageTransition";
import styles from "./ResponsiveContact.module.css";

// Desktop Components
import DesktopContactPage from "./DesktopContactPage";

// Mobile Components
import MobileCalendar from "@/components/Mobile/Calendar/Calendar";
import MobileContactForm from "@/components/Mobile/ContactForm/ContactForm";

interface ResponsiveContactProps {
  settings: {
    siteMaintenance: boolean;
    websiteMessaging: boolean;
    scheduleMeetings: boolean;
  };
}

const ResponsiveContact: React.FC<ResponsiveContactProps> = ({ settings }) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1030);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <FullPageTransition key="mobile">
        {/* Slide 1: Get In Touch */}
        <div id="contact-hero" className={`snap-section ${styles.slide}`}>
          <div className={styles.heroContent}>
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
          <div className={styles.scrollHint}>
            <div className={styles.arrow}>↓</div>
            <span>Scroll to Schedule</span>
          </div>
        </div>

        {/* Slide 2: Schedule Meeting */}
        {settings.scheduleMeetings && (
          <div id="contact-meeting" className={`snap-section ${styles.slide} ${styles.graySlide}`} style={{ padding: 0 }}>
            <div className={styles.calendarWrapper}>
              <div className={styles["calendar-title"]}>Schedule Meeting</div>
              <MobileCalendar />
            </div>
          </div>
        )}

        {/* Slide 3: Send Meeting (Contact Form) */}
        {settings.websiteMessaging && (
          <div id="contact-form" className={`snap-section ${styles.slide} ${styles.graySlide}`}>
            <div className={styles.formWrapper}>
              <MobileContactForm />
            </div>
          </div>
        )}
      </FullPageTransition>
    );
  }

  return <DesktopContactPage settings={settings} />;
};

export default ResponsiveContact;
