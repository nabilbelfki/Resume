"use client";
import React, { useEffect, useRef, useState } from "react";
import Experience from "./Experience";
import styles from "./Timeline.module.css";
import { Experiences } from "./types";

interface TimelineProps {
  experiences: Experiences[];
}

const Timeline: React.FC<TimelineProps> = ({ experiences }) => {
  const [positions, setPositions] = useState<{ [key: string]: number }>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);

  const calculatePositions = () => {
    if (timelineRef.current) {
      const months = timelineRef.current.querySelectorAll(
        `.${styles.indicator}`
      );
      const newPositions: { [key: string]: number } = {};
      const timelineRect = timelineRef.current.getBoundingClientRect();

      months.forEach((month) => {
        const parentElement = month.parentElement;
        if (parentElement) {
          const parentClass = parentElement.className.split(" ");
          const monthYear = parentClass ? parentClass[1] : null;

          if (monthYear) {
            const left =
              parentElement.getBoundingClientRect().left - timelineRect.left;
            console.log(`Month: ${monthYear}, Left: ${left}`);

            const isJanuary = parentClass.includes(styles.year);
            if (isJanuary) {
              const yearClass = parentClass.find((cls) => cls.startsWith("20"));
              const monthYearKey = `${yearClass}`;
              newPositions[monthYearKey] = left;
            } else {
              newPositions[monthYear] = left;
            }
          }
        }
      });

      console.log("New Positions:", newPositions);
      setPositions(newPositions);
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePositions();
    window.addEventListener("resize", calculatePositions);

    return () => {
      window.removeEventListener("resize", calculatePositions);
    };
  }, []);

  const generateMonths = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const elements = [];

    for (let year = 2017; year <= currentYear; year++) {
      for (let month = 0; month < 12; month++) {
        if (year === currentYear && month > currentMonth) break;
        const monthYearClass = `${year}-${months[month].toLowerCase()}`;
        if (month === 0) {
          elements.push(
            <div key={year} className={`${styles.year} ${monthYearClass}`}>
              <div className={styles.indicator}></div>
              <div className={styles.text}>{year}</div>
            </div>
          );
        } else {
          elements.push(
            <div
              key={monthYearClass}
              className={`${
                styles[months[month].toLowerCase()]
              } ${monthYearClass}`}
            >
              <div className={styles.indicator}></div>
            </div>
          );
        }
      }
    }

    return elements;
  };

  return (
    <div className={styles.timeline} ref={timelineRef}>
      {generateMonths()}
      {!loading &&
        experiences.map((experience, index) => (
          <Experience
            key={index}
            index={index}
            experience={experience}
            positions={positions}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        ))}
    </div>
  );
};

export default Timeline;
