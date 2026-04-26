import React from "react";
import Image from "next/image";
import styles from "./Experience.module.css";
import { Experiences } from "@/lib/types";

interface ExperienceDetailProps {
  experience: Experiences;
}

const ExperienceDetail: React.FC<ExperienceDetailProps> = ({ experience }) => {
  return (
    <div className={`${styles.experience} ${styles.standalone}`}>
      <div 
        className={`${styles.information} ${styles['information-additional-styles']}`} 
        style={{ 
          backgroundColor: experience.color.background,
          position: 'relative',
          left: 'auto',
          top: 'auto',
          transform: 'none',
          width: '90vw',
          margin: '0 auto',
          marginTop: '40px'
        }}
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.opened}>
              <Image
                src={"/images/" + experience.logo.opened.name}
                alt={`${experience.name} Logo`}
                width={experience.logo.opened.width}
                height={experience.logo.opened.height}
              />
            </div>
          </div>
          <div className={styles["name-location-and-date"]}>
            <div className={styles.name} style={{ color: experience.color.name }}>
              {experience.name}
            </div>
            <div className={styles["location-and-date"]}>
              <div className={styles.location} style={{ color: experience.color.location }}>
                {experience.location}
              </div>
              <div className={styles.date} style={{ color: experience.color.date }}>
                {experience.period.title}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.details} style={{ backgroundColor: experience.color.details }}>
          <div className={styles.subheader}>
            <div className={styles["title-and-subtitle"]}>
              <span className={styles.title} style={{ color: experience.color.title }}>
                {experience.title}
              </span>
              {experience.subtitle && (
                <span className={styles.subtitle} style={{ color: experience.color.subtitle }}>
                  {" " + experience.subtitle}
                </span>
              )}
            </div>
            <div className={styles.type} style={{ color: experience.color.type }}>
              {experience.type}
            </div>
          </div>
          <div
            className={styles.description}
            style={{
              backgroundColor: experience.color.description.background,
              color: experience.color.description.text,
            }}
          >
            {experience.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
