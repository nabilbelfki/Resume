"use client";
import React from "react";
import Image from "next/image";
import styles from "./Confirmation.module.css";

interface ConfirmationProps {
    firstName: string;
    lastName: string;
    dateTime: Date;
}

const Confirmation: React.FC<ConfirmationProps> = ({ firstName, lastName, dateTime }) => {
  
    const time = dateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    const date = dateTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

  return (
    <div className={styles.confirmation} >
      <div className={styles.icon}>
        <Image src="/images/profile.jpg" alt="Profile Picture" width="250" height="250" />
      </div>
      <div className={styles.message}>
        <h1 className={styles.title}>Thanks for reaching out!</h1>
        <h3 className={styles.text}><i>I look forward to speaking with you {`${firstName} ${lastName}`} at </i><b>{time + " ET"}</b><i> on </i><b>{date}</b><i>. I will give you a call then. If you need to contact me beforehand don’t hesitate to send me an email.</i></h3>
      </div>
    </div>
  );
};

export default Confirmation;
