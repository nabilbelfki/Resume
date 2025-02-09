import React from "react";
import styles from "./ContactForm.module.css";

// interface ContactProps {}

const Contact: React.FC<unknown> = () => {
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
      </div>
    </div>
  );
};

export default Contact;
