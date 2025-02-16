"use client";
import React, { useEffect, useRef, useState } from "react";
import Experience from "./Experience";
import styles from "./Timeline.module.css";

interface Experiences {
    level: number;
    zIndex: number;
    name: string;
    location: string;
    type: string;
    logo: {
      opened: {
        name: string;
        width: number;
        height: number;
      },
      closed: {
        name: string;
        width: number;
        height: number;
      }
    },
    title: string;
    subtitle?: string;
    period: {
      title: string;
      start: string;
      end?: string;
    },
    color: {
      line: string;
      name: string;
      title: string;
      subtitle?: string;
      type: string;
      date: string;
      location: string;
      background: string;
      details: string;
      description: {
        text: string;
        background: string;
      }
    },
    description: string;
}

interface TimelineProps {
  experiences: Experiences[];
}

const Timeline: React.FC<TimelineProps> = ({ experiences }) => {
  const [positions, setPositions] = useState<{ [key: string]: number }>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Initialize state for hovered index
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
            const left = parentElement.getBoundingClientRect().left - timelineRect.left; // Adjust based on timeline's left position
            console.log(`Month: ${monthYear}, Left: ${left}`); // Debug log
  
            // Adjust for January being part of the year div
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
  
      console.log("New Positions:", newPositions); // Debug log
      setPositions(newPositions);
    }
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
          // Create a single div for the year with "January" as part of that div
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
              className={`${styles[months[month].toLowerCase()]} ${monthYearClass}`}
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
      {experiences.map((experience, index) => (
        <Experience
          key={index}
          index={index}
          experience={experience}
          positions={positions}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      ))}
      {generateMonths()}
    </div>
  );
};

export default Timeline;
