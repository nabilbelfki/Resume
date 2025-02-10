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
  return (
    <div
      style={{ backgroundColor, gridArea }}
      className={className}
      onClick={onClick}
    >
      {showDescription && (
        <div className={styles.description}>{description}</div>
      )}
      <div className={styles.logo}>
        <Image src={logoPath} height={height} width="200" alt="Logo" />
      </div>
    </div>
  );
};

export default Skill;
