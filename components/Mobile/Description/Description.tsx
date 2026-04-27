import React from "react";
import styles from "./Description.module.css";
import Button from "@/components/Mobile/Button/Button";

interface DescriptionProps {
  text: string;
  url: string;
  hideButton?: boolean;
}

const Description: React.FC<DescriptionProps> = ({ text, url, hideButton = false }) => {
  const screenWidth = window.innerWidth;
  const mobileWidth = 640;
  return (
    <div className={styles.description}>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      {!hideButton && (
        <Button
          text="VIEW SITE"
          style={{
            position: screenWidth > mobileWidth ? "absolute" : 'static',
            bottom: 5,
            right: 5,
            padding: 0,
            height: 35,
          }}
          onClick={() => window.open(url, "_blank")}
        />
      )}
    </div>
  );
};

export default Description;
