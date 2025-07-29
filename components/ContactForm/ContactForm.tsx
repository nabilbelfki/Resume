"use client";
import React, { useState } from "react";
import { useReCaptcha } from "next-recaptcha-v3";
import Button from "@/components/Button/Button";
import Loading from "@/components/Loading/Loading";
import styles from "./ContactForm.module.css";

const Contact: React.FC<unknown> = () => {
  const { executeRecaptcha } = useReCaptcha();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

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

  const sendEmail = async () => {
    setIsLoading(true);
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recaptchaToken = await executeRecaptcha('contact_form');
    // setRecaptchaToken(await executeRecaptcha("contact_form"));
    

    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      message !== "" &&
      pattern.test(email) &&
      recaptchaToken
    ) {
      const templateParams = {
        firstName,
        lastName,
        email,
        message,
        recaptchaToken,
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
            // Clear input fields
            setFirstName("");
            setLastName("");
            setEmail("");
            setMessage("");
            // setRecaptchaToken(null); // Optionally clear reCAPTCHA token if needed
          } else {
            console.log("Failed to send email");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      if (firstName == "")
      setFirstNameStyles({ border: "solid 1px red" });
      if (lastName == "")
      setLastNameStyles({ border: "solid 1px red" });
      if (email == "" || !pattern.test(email))
      setEmailStyles({ border: "solid 1px red" });
      if (message == "")
      setMessageStyles({ border: "solid 1px red" });
    }
  };

  return (
    <div id="contact" className={styles["contact-form"]}>
      <Loading isLoading={isLoading} zIndex={10}/>
      <div className={styles["contact-form-title"]}>
        Want to get in touch with me?
      </div>
      <div className={styles["email-first-and-last-name"]}>
        <input
          className={styles["first-name"]}
          type="text"
          placeholder="First Name..."
          style={firstNameStyles}
          value={firstName}
          onChange={handleFirstNameChange}
        />
        <input
          className={styles["last-name"]}
          type="text"
          placeholder="Last Name..."
          style={lastNameStyles}
          value={lastName}
          onChange={handleLastNameChange}
        />
        <input
          className={styles["email"]}
          type="text"
          placeholder="Email Address..."
          style={emailStyles}
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className={styles["message"]}>
        <textarea
          placeholder="Then reach out to me and let’s discuss it..."
          style={messageStyles}
          value={message}
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
