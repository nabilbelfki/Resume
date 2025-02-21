"use client";
import React, { useState } from "react";
import Button from "./Button";
import styles from "./ContactForm.module.css";

// interface ContactProps {}

const Contact: React.FC<unknown> = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [firstNameStyles, setFirstNameStyles] = useState({ border: "none" });
  const [lastNameStyles, setLastNameStyles] = useState({ border: "none" });
  const [emailStyles, setEmailStyles] = useState({ border: "none" });
  const [messageStyles, setMessageStyles] = useState({ border: "none" });

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    setFirstNameStyles({ border: "none" });
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setLastNameStyles({ border: "none" });
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailStyles({ border: "none" });
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setMessageStyles({ border: "none" });
  };

  const sendEmail = () => {
    if (firstName != "" && lastName != "" && email != "" && message != "") {
      const templateParams = {
        firstName,
        lastName,
        email,
        message,
      };

      fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateParams),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Email sent successfully");
          } else {
            console.log("Failed to send email");
          }
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
    } else {
      setFirstNameStyles({ border: "solid 1px red" });
      setLastNameStyles({ border: "solid 1px red" });
      setEmailStyles({ border: "solid 1px red" });
      setMessageStyles({ border: "solid 1px red" });
    }
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
          style={firstNameStyles}
          onChange={handleFirstNameChange}
        />
        <input
          className={styles["last-name"]}
          type="text"
          placeholder="Last Name..."
          style={lastNameStyles}
          onChange={handleLastNameChange}
        />
        <input
          className={styles["email"]}
          type="text"
          placeholder="Email Address..."
          style={emailStyles}
          onChange={handleEmailChange}
        />
      </div>
      <div className={styles["message"]}>
        <textarea
          placeholder="Then reach out to me and let’s discuss it..."
          style={messageStyles}
          onChange={handleMessageChange}
        ></textarea>
        <Button
          text="Send"
          onClick={sendEmail}
          style={{
            bottom: 10,
            right: 5,
            position: "absolute",
            fontWeight: 600,
            fontSize: 16,
          }}
        />
      </div>
    </div>
  );
};

export default Contact;
