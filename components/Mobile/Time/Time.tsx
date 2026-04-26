"use client";
import React from "react";
import styles from "./Time.module.css";

interface TimeProps {
  time: string;
  occupied: boolean;
  selected: boolean;
  onClick: () => void;
}

const Time: React.FC<TimeProps> = ({ time, occupied, selected, onClick }) => {
  return (
    <div
      className={`${styles.time} ${occupied ? styles.occupied : ""} ${selected && !occupied ? styles.selected : ""
        }`}
      onClick={onClick}
    >
      <div className={styles.value}>{time}</div>
    </div>
  );
};

export default Time;
