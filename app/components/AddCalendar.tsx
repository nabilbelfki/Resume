"use client";
import React from "react";
import Image from "next/image";
import styles from "./AddCalendar.module.css";

interface AddCalendarProps {
    dateTime: Date;
}

const AddCalendar: React.FC<AddCalendarProps> = ({ dateTime }) => {
  
    // const time = dateTime.toLocaleTimeString("en-US", {
    //     hour: "numeric",
    //     minute: "numeric",
    //     hour12: true,
    // });

    // const date = dateTime.toLocaleDateString("en-US", {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    // });
  console.log(dateTime)
  return (
    <div className={styles["add-calendar"]} >
        <Image src="/images/calendar-binding.svg" alt="Calendar Binding" width="94" height="108" />
      <div className={styles.text}>Add this Event to your Calendar Application</div>
    </div>
  );
};

export default AddCalendar;
