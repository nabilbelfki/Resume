import React from "react";
import Image from "next/image";
import styles from "./Skill.module.css";

interface SkillProps {
  className: string;
  backgroundColor: string;
  height: number;
  logoPath: string;
  description: string;
}

const Skill: React.FC<SkillProps> = ({
  className,
  backgroundColor,
  logoPath,
  height,
  description,
}) => {
  return (
    <div style={{ backgroundColor }} className={`${styles.skill} ${className}`}>
      <div className={styles.description}>{description}</div>
      <div className={styles.logo}>
        <Image
          src={logoPath}
          style={{ height: `${height}px`, width: "auto" }}
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default Skill;
