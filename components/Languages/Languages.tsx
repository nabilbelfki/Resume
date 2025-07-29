import React, { useEffect, useState } from "react";
import styles from "./Languages.module.css";

interface Language {
  name: string;
  color: string;
  percentage: number;
}

interface LanguagesProps {
  languages: Language[];
}

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex < languages.length) {
      const timer = setTimeout(() => {
        setActiveIndex(activeIndex + 1);
      }, 1000); // Adjust the duration as needed
      return () => clearTimeout(timer);
    }
  }, [activeIndex, languages.length]);

  return (
    <div className={styles.languages}>
      <div className={styles["languages-title"]}>Languages</div>
      <div className={styles["distribution-bar"]}>
        {languages.map((language, index) => (
          <div
            key={index}
            className={styles["distribution-segment"]}
            style={{
              backgroundColor: language.color,
              width: activeIndex > index ? `${language.percentage}%` : "0",
              transitionDelay: `${index * 1}s`, // Delay each segment's transition
            }}
          ></div>
        ))}
      </div>
      <div className={styles["legend"]}>
        {languages.map((language, index) => (
          <div key={index} className={styles["indicator"]}>
            <div
              className={styles["indicator-color"]}
              style={{ backgroundColor: language.color }}
            ></div>
            <div className={styles["indicator-name"]}>{language.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages;
