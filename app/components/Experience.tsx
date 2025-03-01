import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Experience.module.css";
import { Experiences } from "./types";

interface ExperienceProps {
  experience: Experiences;
  positions: { [key: string]: number };
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

const Experience: React.FC<ExperienceProps> = ({
  experience,
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
  const informationTop =
    hoveredIndex == index
      ? experience.name == "Cole Solutions LLC"
        ? -360
        : -320
      : experience.name == "Cole Solutions LLC"
      ? -240
      : -200;
  const translateX =
    experience.name == "Cole Solutions LLC"
      ? "translateX(calc(-50% - 70px))"
      : experience.name == "New Jersey Institute of Technology"
      ? "translateX(calc(-50% + 100px))"
      : "translateX(-50%)";
  const animationClass =
    experience.name == "Cole Solutions LLC"
      ? "floating-cole"
      : experience.name == "New Jersey Institute of Technology"
      ? "floating-njit"
      : "floating";

  // State for managing width and margin during animation for both lines
  const [width, setWidth] = useState(0);
  const [marginLeft, setMarginLeft] = useState("100%");

  const [widthLine2, setWidthLine2] = useState(0);
  const [marginLeftLine2, setMarginLeftLine2] = useState("100%");

  useEffect(() => {
    if (experience.level === 1 || experience.level === 2) {
      const interval = setInterval(() => {
        // Update for line 1 (same as before)
        setWidth((prevWidth) => {
          if (prevWidth < 100) {
            return prevWidth + 1; // Increment width by 1%
          } else {
            clearInterval(interval); // Stop the interval when the animation is complete
            return prevWidth;
          }
        });

        setMarginLeft((prevMargin) => {
          if (prevMargin !== "0%") {
            return `${parseFloat(prevMargin) - 1}%`; // Decrease margin-left by 1%
          } else {
            return prevMargin;
          }
        });

        // Update for line 2 (if it's level 2, animate the slanted line)
        if (experience.level === 2) {
          setWidthLine2((prevWidth) => {
            if (prevWidth < 100) {
              return prevWidth + 1; // Increment width by 1% for line 2
            } else {
              return prevWidth;
            }
          });

          setMarginLeftLine2((prevMargin) => {
            if (prevMargin !== "0%") {
              return `${parseFloat(prevMargin) - 1}%`; // Decrease margin-left by 1% for line 2
            } else {
              return prevMargin;
            }
          });
        }
      }, 20); // Update every 20ms for smooth animation

      // Cleanup the interval on unmount
      return () => clearInterval(interval);
    }
  }, [experience.level]); // Run only when experience.level changes

  return (
    <div
      className={styles.experience}
      style={{
        top: `${top}px`,
        left: `${endX}px`,
        width: `${
          experience.level == 1
            ? experience.name == "American College of Thessaloniki"
              ? duration + 8
              : duration + 12
            : duration - 75
        }px`,
      }}
    >
      <div
        className={
          index != hoveredIndex
            ? `${styles.information} ${styles[animationClass]}`
            : styles.information
        }
        style={{
          backgroundColor: experience.color.background,
          zIndex: zIndex,
          top: informationTop,
          transform: translateX,
        }}
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

      <div
        className={styles.line}
        style={{
          backgroundColor: experience.color.line,
          width: `${width}%`,
          marginLeft: marginLeft,
        }}
      ></div>

      {/* Apply dynamic inline styles for the slanted line (line 2) */}
      {experience.level == 2 && (
        <div
          className={styles["position-line2"]}
          style={{ marginLeft: duration - 89 }}
        >
          <div
            className={`${styles.line} ${styles.line2}`}
            style={{
              backgroundColor: experience.color.line,
              transform: "rotate(30deg)",
              width: `${widthLine2}%`, // Animated width for slanted line
              marginTop: 33,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Experience;
