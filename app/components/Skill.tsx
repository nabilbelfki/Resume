import React from "react";
import styles from "./Skill.module.css";

interface SkillProps {
    backgroundColor: string;
    logoPath: string;
    height: number;
}

const Skill: React.FC<SkillProps> = ({ backgroundColor, logoPath, height }) => {
  return (
    <div style={{ backgroundColor }} className={styles.skill}>
      <div className={styles.logo}>
        <img src={logoPath} style={{ height: `${height}px`, width: 'auto'}} alt="Logo" />
      </div>
    </div>
  );
};

export default Skill;
