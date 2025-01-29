import React from "react";
import styles from "./ContactForm.module.css";

interface Language {
  language: string;
  color: string;
  percentage: number;
}

interface LanguagesProps {
  languages: Language[];
}

const Languages: React.FC<LanguagesProps> = ({}) => {
  return <div className={styles["contact-form"]}></div>;
};

export default Languages;
