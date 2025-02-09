"use client";
import React, { useEffect, useRef, useState } from "react";
import Experience from "./Experience";
import styles from "./Timeline.module.css";

interface ExperienceData {
  startDate: string;
  endDate: string;
}

interface TimelineProps {
  experiences: ExperienceData[];
}

const Timeline: React.FC<TimelineProps> = ({ experiences }) => {
  const [positions, setPositions] = useState<{ [key: string]: number }>({});
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) {
      const months = timelineRef.current.querySelectorAll(
        `.${styles.indicator}`
      );
      const newPositions: { [key: string]: number } = {};
      months.forEach((month) => {
        const parentClass = month.parentElement?.className.split(" ");
        const monthName = parentClass
          ? parentClass[parentClass.length - 1]
          : null;
        if (monthName) {
          newPositions[monthName] = month.getBoundingClientRect().left;
        }
      });
      setPositions(newPositions);
    }
  }, []);

  const generateMonths = () => {
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
    const currentMonth = new Date().getMonth();
    const elements = [];

    for (let year = 2017; year <= currentYear; year++) {
      elements.push(
        <div key={year} className={styles.year}>
          <div className={styles.indicator}></div>
          <div className="text">{year}</div>
        </div>
      );

      for (let month = 0; month < 12; month++) {
        if (year === currentYear && month > currentMonth) break;
        elements.push(
          <div
            key={`${year}-${months[month]}`}
            className={`${styles[months[month]]} ${year}-${months[month]}`}
          >
            <div className={styles.indicator}></div>
          </div>
        );
      }
    }

    return elements;
  };

  return (
    <div className={styles.timeline} ref={timelineRef}>
      {experiences.map((experience, index) => (
        <Experience
          key={index}
          startDate={experience.startDate}
          endDate={experience.endDate}
          positions={positions}
        />
      ))}
      {generateMonths()}
    </div>
  );
};

export default Timeline;
