import React from "react";
import Image from "next/image";
import styles from "./Skill.module.css";

interface SkillProps {
  gridArea: string;
  className: string;
  backgroundColor: string;
  height: number;
  logoPath: string;
  description: string;
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
  const logoStyle = {
    alignItems: showDescription ? "flex-start" : "center",
    justifyContent: showDescription ? "flex-end" : "center",
    height: showDescription ? "100px" : "100%"
  };

  const imageStyle = {
    height: showDescription ? "100px" : "100%",
    width: "auto"
  };

  return (
    <div
      style={{ backgroundColor, gridArea }}
      className={className}
      onClick={onClick}
    >
      {showDescription && (
        <div className={styles.description}>{description}</div>
      )}
      <div className={styles.logo} style={logoStyle}>
        <Image src={logoPath} height={height} width="200" alt="Logo" style={imageStyle}/>
      </div>
    </div>
  );
};

export default Skill;
