import React from "react";
import styles from "./Experience.module.css";

interface ExperienceProps {
  startDate: string;
  endDate: string;
  positions: { [key: string]: number };
}

const Experience: React.FC<ExperienceProps> = ({
  startDate,
  endDate,
  positions,
}) => {
  const startX = positions[startDate];
  const endX = positions[endDate];
  const duration = endX - startX;

  return (
    <div
      className={styles.experience}
      style={{
        left: `${startX}px`,
        width: `${duration}px`,
      }}
    >
      <div className={styles.line}></div>
    </div>
  );
};

export default Experience;
