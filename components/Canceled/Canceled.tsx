"use client";
import React from "react";
import Image from "next/image";
import styles from "./Canceled.module.css";

interface CanceledProps {
  firstName: string;
  lastName: string;
  dateTime: Date;
}

const Canceled: React.FC<CanceledProps> = ({
  firstName,
  lastName,
  dateTime,
}) => {
  let time =
    dateTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }) + " ET";

  let date = dateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (time == "Invalid Date ET") time = "God knows what time";
  if (date == "Invalid Date") date = "what date either";

  return (
    <div className={styles.confirmation}>
      <div className={styles.icon}>
        <Image
          src="/images/profile.png"
          alt="Profile Picture"
          width="250"
          height="250"
        />
      </div>
      <div className={styles.message}>
        <h1 className={styles.title}>Sorry to see you go!</h1>
        <h3 className={styles.text}>
          <i>
            I was look forward to speaking with you {`${firstName} ${lastName}`} but understand that things come up. If you want you can always reach out to me in the future again.
          </i>
        </h3>
      </div>
    </div>
  );
};

export default Canceled;
