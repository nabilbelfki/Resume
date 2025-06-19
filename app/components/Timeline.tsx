"use client";
import React, { useEffect, useRef, useState } from "react";
import Experience from "./Experience";
import styles from "./Timeline.module.css";
import { Experiences } from "./types";

interface TimelineProps {
  experiences: Experiences[];
}

const Timeline: React.FC<TimelineProps> = ({ experiences }) => {
  const mobileWidth = 640;
  const verticalWidth = 768;
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    window.innerWidth < verticalWidth ? "vertical" : "horizontal"
  );

  const [positions, setPositions] = useState<{ [key: string]: number }>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);

  const calculatePositions = (dir: "horizontal" | "vertical") => {
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
            const offset =
              dir === "vertical"
                ? parentElement.getBoundingClientRect().top - timelineRect.top
                : parentElement.getBoundingClientRect().left - timelineRect.left;

            console.log(`Month: ${monthYear}, Offset: ${offset}, Direction: ${dir}`);

            const isJanuary = parentClass.includes(styles.year);
            if (isJanuary) {
              const yearClass = parentClass.find((cls) => cls.startsWith("20"));
              const monthYearKey = `${yearClass}`;
              newPositions[monthYearKey] = offset;
            } else {
              newPositions[monthYear] = offset;
            }
          }
        }
      });

      setPositions(newPositions);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newDirection = window.innerWidth < verticalWidth ? "vertical" : "horizontal";
      setDirection(newDirection);
      calculatePositions(newDirection); // use updated direction
    };

    handleResize(); // initial

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    console.log(currentMonth);
    console.log(currentYear);
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
    <div
      className={styles.timeline}
      ref={timelineRef}
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row-reverse" : "column-reverse",
        height: direction === "horizontal" ? 500 : 600,
        paddingTop: direction === "vertical" ? 50: 0,
        paddingBottom: direction === "vertical" ? 50: 0,
        paddingLeft: direction === "vertical" ? 0: 20,
        paddingRight: direction === "vertical" ? 0: 20,
        marginLeft: direction === "vertical" ? (window.innerWidth > mobileWidth ? 140 : 40) : 0
      }}
    >
      {generateMonths()}
      {!loading &&
        experiences.map((experience, index) => (
          <Experience
            key={index}
            index={index}
            experience={experience}
            positions={positions}
            direction={direction}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        ))}
    </div>
  );
};

export default Timeline;
