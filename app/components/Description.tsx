import React from "react";
import styles from "./Description.module.css";
import Button from "./Button";

interface DescriptionProps {
  text: string;
  url: string;
}

const Description: React.FC<DescriptionProps> = ({ text, url }) => {
  return (
    <div className={styles.description}>
      <div className={styles.text}>{text}</div>
      <Button
        text="VIEW SITE"
        style={{
          position: "absolute",
          bottom: 5,
          right: 5,
          padding: 0,
          height: 25,
        }}
        onClick={() => window.open(url, "_blank")}
      />
    </div>
  );
};

export default Description;
