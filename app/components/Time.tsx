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
      className={`${styles.time} ${occupied ? styles.occupied : ""} ${
        selected && !occupied ? styles.selected : ""
      }`}
      onClick={onClick}
    >
      <div className={styles.icon}>
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.99073 0.0126762C5.0524 0.101197 4.33917 0.301003 3.56018 0.693027C2.94053 1.00159 2.43722 1.37085 1.90357 1.90198C1.33703 2.47105 0.977882 2.97183 0.638971 3.67494C0.239359 4.49946 0.0395533 5.31891 0.00414467 6.25471C-0.0337932 7.33215 0.188775 8.359 0.669321 9.32515C1.0057 10.0055 1.35473 10.486 1.90357 11.0374C2.46252 11.5938 2.94559 11.9403 3.62594 12.2742C4.10143 12.5069 4.40746 12.6207 4.89054 12.7421C6.15513 13.0608 7.42731 12.9975 8.6565 12.5625C8.99288 12.4436 9.59988 12.1503 9.88568 11.9682C11.4083 11.002 12.473 9.46678 12.817 7.74694C12.9131 7.27145 12.9334 7.04635 12.9334 6.4697C12.9334 5.89304 12.9131 5.66794 12.817 5.19245C12.4832 3.51813 11.4639 2.01579 10.0121 1.0547C9.68082 0.834662 8.97265 0.483105 8.62109 0.361704C8.10513 0.184661 7.57653 0.0708475 7.04035 0.0202637C6.78237 -0.00249863 6.19813 -0.00755787 5.99073 0.0126762ZM7.28062 0.918125C8.50222 1.10276 9.55436 1.63389 10.4295 2.51151C11.3121 3.39167 11.8357 4.4337 12.0279 5.68565C12.0886 6.08273 12.0886 6.85666 12.0279 7.25374C11.8787 8.23001 11.5246 9.07476 10.9404 9.85881C10.7102 10.1674 10.169 10.7086 9.86039 10.9388C8.8386 11.7001 7.73334 12.0693 6.47128 12.0693C5.21174 12.0693 4.10143 11.6975 3.08723 10.9388C1.91874 10.0611 1.14481 8.74849 0.917182 7.25374C0.853952 6.8516 0.853952 6.0802 0.914652 5.68565C1.20551 3.80646 2.32847 2.26365 4.00532 1.43661C4.65279 1.11793 5.24462 0.956063 6.07925 0.870071C6.27653 0.849837 7.02011 0.880188 7.28062 0.918125Z"
            fill={occupied ? "#8DB3C6" : "#79D2FF"}
          />
          <path
            d="M6.33717 2.61016C6.2183 2.65315 6.13231 2.73156 6.08173 2.84031C6.04632 2.91366 6.04126 3.14887 6.04126 4.74226V6.56328L6.09943 6.66697C6.14243 6.74791 6.40799 6.97301 7.26792 7.66094C7.87998 8.14908 8.41111 8.56386 8.44905 8.5841C8.48698 8.60433 8.57298 8.61951 8.64127 8.61951C8.9473 8.61951 9.14457 8.28818 9.008 8.00238C8.97765 7.93916 8.69438 7.69635 7.93562 7.08935L6.90118 6.2623L6.89613 4.56269L6.88854 2.86054L6.81772 2.76949C6.69632 2.61016 6.50916 2.54693 6.33717 2.61016Z"
            fill={occupied ? "#8DB3C6" : "#79D2FF"}
          />
        </svg>
      </div>
      <div className={styles.value}>{time}</div>
    </div>
  );
};

export default Time;
