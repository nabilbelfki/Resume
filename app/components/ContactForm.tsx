"use client"
import React from "react";
import Button from "./Button";
import styles from "./ContactForm.module.css";

// interface ContactProps {}

const Contact: React.FC<unknown> = () => {
  
  const sendEmail = () => {
    console.log("sent")
  };

  return (
    <div className={styles["contact-form"]}>
      <div className={styles["contact-form-title"]}>
        Need a Website, Integration or Application?
      </div>
      <div className={styles["email-first-and-last-name"]}>
        <input
          className={styles["first-name"]}
          type="text"
          placeholder="First Name..."
        />
        <input
          className={styles["last-name"]}
          type="text"
          placeholder="Last Name..."
        />
        <input
          className={styles["email"]}
          type="text"
          placeholder="Email Address..."
        />
      </div>
      <div className={styles["message"]}>
        <textarea placeholder="Then reach out to me and let’s discuss it..."></textarea>
        <Button text="Send" onClick={sendEmail} style={{ bottom: 10, right: 5, position: "absolute", fontWeight: 600, fontSize: 16}}/>
      </div>
    </div>
  );
};

export default Contact;
