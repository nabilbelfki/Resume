"use client";
import React, { useState, useEffect, useMemo } from "react";
import Skill from "@/components/Skill/Skill";
import Scrubber from "@/components/Scrubber/Scrubber";
import styles from "./Skills.module.css";

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

interface Skill {
  name: string;
  type: string;
  image: Image;
  description: Description;
}

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [type, setType] = useState("backend");
  const [backgroundColor, setBackgroundColor] = useState("rgba(96, 96, 96, 0.1)");
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  // State for expanded skills
  const [clickedMobileIndex, setMobileClickedIndex] = useState<number | null>(0);
  const [clickedFrontendIndex, setFrontendClickedIndex] = useState<number | null>(0);
  const [clickedBackendIndex, setBackendClickedIndex] = useState<number | null>(0);
  const [clickedDatabaseIndex, setDatabaseClickedIndex] = useState<number | null>(0);
  const [clickedCloudIndex, setCloudClickedIndex] = useState<number | null>(0);
  const [clickedMiscellaneousIndex, setMiscellaneousClickedIndex] = useState<number | null>(0);

  // Categorize skills with memoization
  const { mobile, frontend, backend, database, cloud, miscellaneous } = useMemo(() => {
    const mobile: Skill[] = [];
    const frontend: Skill[] = [];
    const backend: Skill[] = [];
    const database: Skill[] = [];
    const cloud: Skill[] = [];
    const miscellaneous: Skill[] = [];

    skills.forEach((skill) => {
      if (skill.type === "mobile") mobile.push(skill);
      else if (skill.type === "frontend") frontend.push(skill);
      else if (skill.type === "backend") backend.push(skill);
      else if (skill.type === "database") database.push(skill);
      else if (skill.type === "cloud") cloud.push(skill);
      else miscellaneous.push(skill);
    });

    return { mobile, frontend, backend, database, cloud, miscellaneous };
  }, [skills]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update background color when type changes
  useEffect(() => {
    const currentSkills = 
      type === "mobile" ? mobile :
      type === "frontend" ? frontend :
      type === "backend" ? backend :
      type === "database" ? database :
      type === "cloud" ? cloud :
      miscellaneous;
    
    if (currentSkills.length > 0) {
      setBackgroundColor(hexToRgba(currentSkills[0].image.backgroundColor, 0.3));
    }
  }, [type, mobile, frontend, backend, database, cloud, miscellaneous]);

  const hexToRgba = (hex: string, alpha: number) => {
    if (hex == "#FFFFFF") return `rgba(96, 96, 96, 0.1)`;
    if (hex == "#EAF9FF") return `rgba(47, 129, 255, 0.3)`;
    hex = hex.replace(/^#/, "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const renderSkills = (
    skills: Skill[],
    clickedIndex: number | null,
    setClickedIndex: React.Dispatch<React.SetStateAction<number | null>>,
    isMobile: boolean
  ) => {
    const columns = isMobile ? 2 : 3;

    return skills.map((skill, index) => {
      const originalRow = Math.floor(index / columns) + 1;
      const originalCol = (index % columns) + 1;
      let gridArea = `${originalRow} / ${originalCol} / ${originalRow + 1} / ${originalCol + 1}`;

      if (clickedIndex !== null) {
        const clickedRow = Math.floor(clickedIndex / columns) + 1;
        const clickedCol = (clickedIndex % columns) + 1;

        if (clickedIndex === index) {
          if (isMobile) {
            gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 3`;
          } else {
            gridArea = clickedCol === 1 
              ? `${clickedRow} / 1 / ${clickedRow + 2} / 3`
              : `${clickedRow} / 2 / ${clickedRow + 2} / 4`;
          }
        } else {
          if (isMobile) {
            const currentRow = Math.floor(index / columns) + 1;
            if (currentRow === clickedRow) {
              gridArea = `${clickedRow + 1} / 1 / ${clickedRow + 2} / 2`;
            } else if (currentRow > clickedRow) {
              gridArea = originalCol === 1
                ? `${currentRow} / 2 / ${currentRow + 1} / 3`
                : `${currentRow + 1} / 1 / ${currentRow + 2} / 2`;
            }
          } else {
            if (originalRow === clickedRow) {
              if (clickedCol === 1) {
                if (originalCol === 2) gridArea = `${clickedRow} / 3 / ${clickedRow + 1} / 4`;
                if (originalCol === 3) gridArea = `${clickedRow + 1} / 3 / ${clickedRow + 2} / 4`;
              } else if (clickedCol === 2) {
                if (originalCol === 1) gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 2`;
                if (originalCol === 3) gridArea = `${clickedRow + 1} / 1 / ${clickedRow + 2} / 2`;
              } else {
                if (originalCol === 1) gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 2`;
                if (originalCol === 2) gridArea = `${clickedRow + 1} / 1 / ${clickedRow + 2} / 2`;
              }
            } else if (originalRow > clickedRow) {
              gridArea = `${originalRow + 1} / ${originalCol} / ${originalRow + 2} / ${originalCol + 1}`;
            }
          }
        }
      }

      return (
        <Skill
          key={index}
          gridArea={gridArea}
          isMobile={isMobile}
          image={skill.image}
          name={skill.name}
          description={skill.description}
          showDescription={clickedIndex === index}
          onClick={() => {
            setClickedIndex(clickedIndex === index ? null : index);
            setBackgroundColor(hexToRgba(skill.image.backgroundColor, 0.3));
          }}
          className={`${styles.skill} ${clickedIndex === index ? styles.clicked : ""}`}
        />
      );
    });
  };

  return (
    <div className={styles.skills} style={{ backgroundColor }}>
      {type === "mobile" && (
        <div className={styles.mobile}>
          {renderSkills(mobile, clickedMobileIndex, setMobileClickedIndex, isMobile)}
        </div>
      )}
      {type === "frontend" && (
        <div className={styles.frontend}>
          {renderSkills(frontend, clickedFrontendIndex, setFrontendClickedIndex, isMobile)}
        </div>
      )}
      {type === "backend" && (
        <div className={styles.backend}>
          {renderSkills(backend, clickedBackendIndex, setBackendClickedIndex, isMobile)}
        </div>
      )}
      {type === "database" && (
        <div className={styles.database}>
          {renderSkills(database, clickedDatabaseIndex, setDatabaseClickedIndex, isMobile)}
        </div>
      )}
      {type === "cloud" && (
        <div className={styles.cloud}>
          {renderSkills(cloud, clickedCloudIndex, setCloudClickedIndex, isMobile)}
        </div>
      )}
      {type === "miscellaneous" && (
        <div className={styles.miscellaneous}>
          {renderSkills(miscellaneous, clickedMiscellaneousIndex, setMiscellaneousClickedIndex, isMobile)}
        </div>
      )}
      <Scrubber type={type} setType={setType} />
    </div>
  );
};

export default Skills;