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

interface SkillProps {
  gridArea: string;
  className: string;
  image: Image;
  isMobile: boolean;
  description: Description;
  onClick: () => void;
  showDescription: boolean;
}

const Skill: React.FC<SkillProps> = ({
  gridArea,
  className,
  image,
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
    height: screenWidth > mobileWidth ? skillHeight : skillHeight * 0.7,
    padding: 5
  };

  const logoStyle = {
    alignItems: "center",
    justifyContent: showDescription ? "flex-end" : "center",
    height: showDescription ? "100px" : "100%",
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
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default Skill;
