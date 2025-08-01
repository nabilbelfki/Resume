import React from "react";
import Image from "next/image";
import styles from "./Skill.module.css";

interface Image {
  name: string;
  url: string;
  backgroundColor: string;
  height: number;
  width: number;
}

interface Description {
  color: string;
  text: string;
  backgroundColor: string;
}

type MobileImageHeightOverflows = {
  Redis: string;
  "React Native": string;
  Jenkins: string;
  React: string;
  PHP: string;
  PostgreSQL: string;
  jQuery: string;
};

interface SkillProps {
  gridArea: string;
  className: string;
  image: Image;
  name: string;
  isMobile: boolean;
  description: Description;
  onClick: () => void;
  showDescription: boolean;
}

const Skill: React.FC<SkillProps> = ({
  gridArea,
  className,
  image,
  name,
  isMobile,
  description,
  onClick,
  showDescription,
}) => {
  const mobileWidth = 640;
  const screenWidth = window.innerWidth;

  const skillWidth = showDescription ? 420 : 200
  const skillHeight = showDescription ? 310 : 150

  const skillStyle = {
    backgroundColor: image.backgroundColor,
    width: screenWidth > mobileWidth ? skillWidth : "100%",
    height: screenWidth > mobileWidth ? skillHeight : skillHeight * 0.7
  };

  const logoStyle = {
    alignItems: "center",
    justifyContent: showDescription ? "flex-end" : "center",
    height: showDescription ? "60px" : "100%",
  };

  const mobileImageHeightOverflows: MobileImageHeightOverflows = {
    Redis: "90%",
    "React Native": "70%",
    Jenkins: "70%",
    React: "70%",
    PHP: "70%",
    PostgreSQL: "70%",
    jQuery: "70%"
  };

  return (
    <div
      style={{ gridArea, ...skillStyle }}
      className={className}
      onClick={onClick}
    >
      {showDescription && (
        <div
          className={styles.description}
          style={{
            backgroundColor: description.backgroundColor,
            color: description.color,
          }}
        >
          {description.text}
        </div>
      )}
      <div className={styles.logo} style={logoStyle}>
        <Image
          src={image.url + image.name}
          height={
            showDescription ? image.height * 0.6 : isMobile ? 50 : image.height
          }
          width={
            showDescription ? image.width * 0.6 : isMobile ? 50 : image.width
          }

          style={{
            height: showDescription ? "100%" : isMobile ? 50 : image.height,
            width: showDescription ? "auto" : isMobile ? 50 : image.width,
            maxHeight: showDescription && image.width > 175 
              ? 40 
              : (name in mobileImageHeightOverflows 
                  ? mobileImageHeightOverflows[name as keyof MobileImageHeightOverflows] 
                  : "unset")
          }}

          alt="Logo"
        />
      </div>
    </div>
  );
};

export default Skill;
