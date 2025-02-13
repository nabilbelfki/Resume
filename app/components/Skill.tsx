import React from "react";
import Image from "next/image";
import styles from "./Skill.module.css";

interface Description {
  color: string;
  text: string;
  backgroundColor: string;
}

interface SkillProps {
  gridArea: string;
  className: string;
  backgroundColor: string;
  height: number;
  logoPath: string;
  description: Description;
  onClick: () => void;
  showDescription: boolean;
}

const Skill: React.FC<SkillProps> = ({
  gridArea,
  className,
  backgroundColor,
  logoPath,
  height,
  description,
  onClick,
  showDescription,
}) => {
  const skillStyle = {
    width: showDescription ? "410px" : "200px",
    height: showDescription ? "310px" : "150px",
  };

  const logoStyle = {
    alignItems: showDescription ? "flex-start" : "center",
    justifyContent: showDescription ? "flex-end" : "center",
    height: showDescription ? "100px" : "100%",
  };

  const imageStyle = {
    height: showDescription ? "100px" : "100%",
    width: "auto",
  };

  return (
    <div
      style={{ backgroundColor, gridArea, ...skillStyle }}
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
          src={logoPath}
          height={height}
          width="200"
          alt="Logo"
          style={imageStyle}
        />
      </div>
    </div>
  );
};

export default Skill;
