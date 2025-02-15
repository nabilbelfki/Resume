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
  description: Description;
  onClick: () => void;
  showDescription: boolean;
}

const Skill: React.FC<SkillProps> = ({
  gridArea,
  className,
  image,
  description,
  onClick,
  showDescription,
}) => {
  const skillStyle = {
    backgroundColor: image.backgroundColor,
    width: showDescription ? "410px" : "200px",
    height: showDescription ? "310px" : "150px",
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
          height={showDescription ? image.height * 0.7 : image.height}
          width={showDescription ? image.width * 0.7 : image.width}
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default Skill;
