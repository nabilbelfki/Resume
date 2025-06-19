import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Experience.module.css";
import { Experiences } from "./types";

interface ExperienceProps {
  experience: Experiences;
  positions: { [key: string]: number };
  direction: "horizontal" | "vertical",
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

const Experience: React.FC<ExperienceProps> = ({
  experience,
  direction,
  positions,
  index,
  hoveredIndex,
  setHoveredIndex,
}) => {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const currentYear = new Date().getFullYear();
  const currentMonth = months[new Date().getMonth()];
  let endYearMonth = `${currentYear}-${currentMonth}`;


  const mobileWidth = 640;
  const screenWidth = window.innerWidth;
  const startDate = experience.period.start;

  if (experience.period.end) {
    const endDate = experience.period.end; // Default to today if endDate is missing
    const [endYear, endMonth] = endDate.slice(0, 7).split("-"); // Extracts year and month as YYYY-MM
    endYearMonth = endYear + "-" + months[parseInt(endMonth) - 1];
  }

  const [startYear, startMonth] = startDate.slice(0, 7).split("-"); // Extracts year and month as YYYY-MM
  const startYearMonth = startYear + "-" + months[parseInt(startMonth) - 1];

  const startX = positions[startYearMonth];
  const endX = positions[endYearMonth];
  const duration = Math.abs(startX - endX);

  const top = experience.level == 1 ? 393 : 353;
  const zIndex = hoveredIndex == index ? 10 : experience.zIndex;
  const informationTop = direction === "vertical" ? "50%" : (hoveredIndex == index ? (experience.name == "Cole Solutions LLC" ? -360 : -320) : (experience.name == "Cole Solutions LLC" ? -240 : -200));
  const translateX = experience.name == "Cole Solutions LLC" ? "translateX(calc(-50% - 70px))" : (experience.name == "New Jersey Institute of Technology" ? "translateX(calc(-50% + 100px))" : "translateX(-50%)");
  const animationClass = experience.name == "Cole Solutions LLC" ? "floating-cole" : (experience.name == "New Jersey Institute of Technology" ? "floating-njit" : "floating");
  return (
    <div
      className={styles.experience}
      style={{
        // top: `${top}px`,
        // left: `${endX}px`,
        // width: `${experience.level == 1 ? (experience.name == "American College of Thessaloniki" ? duration + 8 : duration + 12) : duration - 75}px`,
        top: direction === "vertical" ? `${endX}px`: `${top}px`,
        height: `${experience.level == 1 ? (experience.name == "American College of Thessaloniki" ? duration + 8 : duration + 12) : duration - 75}px`,
        width: direction === "vertical" ? 8 : `${experience.level == 1 ? (experience.name == "American College of Thessaloniki" ? duration + 8 : duration + 12) : duration - 75}px`,
        left: direction === "vertical" ?  (experience.name == "New Jersey Institute of Technology" ? 98 : 70): `${endX}px`
      }}
    >
      <div className={index != hoveredIndex ? `${styles.information} ${styles[animationClass]}` : `${styles.information} ${styles[`information-additional-styles`]}` } style={{backgroundColor: experience.color.background, zIndex: zIndex, left: direction === "vertical"? (experience.name == "Cole Solutions LLC" ? 200 : 50) : "50%", top: informationTop, transform: translateX, width: index === hoveredIndex && screenWidth <= mobileWidth ? "90vw" : "unset", position: screenWidth <= mobileWidth && index === hoveredIndex ? "fixed" : "absolute"}}
      onMouseEnter={() => setHoveredIndex(index)} // Set state to index on hover
      onMouseLeave={() => setHoveredIndex(null)} // Set state to null when hover ends
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            {index == hoveredIndex && (
              <div className={styles.opened}>
                <Image
                  src={"/images/" + experience.logo.opened.name}
                  alt={`${experience.name} Logo`}
                  width={experience.logo.opened.width}
                  height={experience.logo.opened.height}
                />
              </div>
            )}
            {index != hoveredIndex && (
              <div className={styles.closed}>
                <Image
                  src={"/images/" + experience.logo.closed.name}
                  alt={`${experience.name} Logo`}
                  width={experience.logo.closed.width}
                  height={experience.logo.closed.height}
                />
              </div>
            )}
          </div>
          {index == hoveredIndex && (
            <div className={styles["name-location-and-date"]}>
              <div
                className={styles.name}
                style={{ color: experience.color.name }}
              >
                {experience.name}
              </div>
              <div className={styles["location-and-date"]}>
                <div
                  className={styles.location}
                  style={{ color: experience.color.location }}
                >
                  {experience.location}
                </div>
                <div
                  className={styles.date}
                  style={{ color: experience.color.date }}
                >
                  {experience.period.title}
                </div>
              </div>
            </div>
          )}
        </div>
        {index == hoveredIndex && (
          <div
            className={styles.details}
            style={{ backgroundColor: experience.color.details }}
          >
            <div className={styles.subheader}>
              <div className={styles["title-and-subtitle"]}>
                <span
                  className={styles.title}
                  style={{ color: experience.color.title }}
                >
                  {experience.title}
                </span>
                {experience.subtitle && (
                  <span
                    className={styles.subtitle}
                    style={{ color: experience.color.subtitle }}
                  >
                    {" " + experience.subtitle}
                  </span>
                )}
              </div>
              <div
                className={styles.type}
                style={{ color: experience.color.type }}
              >
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
        )}
      </div>
      <div className={styles.line} style={{
          backgroundColor: experience.color.line,
          height: direction === "vertical" ? "100%" : "7px"
        }}
      >

        </div>
      {experience.level == 2 && (
        <div className={styles.line} style={{
          backgroundColor: experience.color.line, 
          transform: direction === "vertical" ? 'rotate(110deg)' : 'rotate(30deg)', 
          width: 82, 
          marginLeft: direction === "vertical" ? "-50px" : duration - 82, 
          marginTop: direction === "vertical" ? "33px" : 13
        }}>
        </div>
      )}
    </div>
  );
};

export default Experience;
