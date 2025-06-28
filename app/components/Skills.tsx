"use client";
import React, { useState, useEffect } from "react";
import Skill from "./Skill";
import Scrubber from "./Scrubber";
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
  const [backgroundColor, setBackgroundColor] = useState(
    "rgba(96, 96, 96, 0.1)"
  );

  const [clickedMobileIndex, setMobileClickedIndex] = useState<number | null>(
    null
  );
  const [clickedFrontendIndex, setFrontendClickedIndex] = useState<
    number | null
  >(null);
  const [clickedBackendIndex, setBackendClickedIndex] = useState<number | null>(
    null
  );
  const [clickedDatabaseIndex, setDatabaseClickedIndex] = useState<
    number | null
  >(null);
  const [clickedCloudIndex, setCloudClickedIndex] = useState<number | null>(
    null
  );
  const [clickedMiscellaneousIndex, setMiscellaneousClickedIndex] = useState<
    number | null
  >(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobile: Skill[] = [];
  const frontend: Skill[] = [];
  const backend: Skill[] = [];
  const database: Skill[] = [];
  const cloud: Skill[] = [];
  const miscellaneous: Skill[] = [];

  skills.forEach(function (skill) {
    if (skill.type === "mobile") {
      mobile.push(skill);
    } else if (skill.type === "frontend") {
      frontend.push(skill);
    } else if (skill.type === "backend") {
      backend.push(skill);
    } else if (skill.type === "database") {
      database.push(skill);
    } else if (skill.type === "cloud") {
      cloud.push(skill);
    } else {
      miscellaneous.push(skill);
    }
  });

  function hexToRgba(hex: string, alpha: number) {
    if (hex == "#FFFFFF") return `rgba(96, 96, 96, 0.1)`;
    if (hex == "#EAF9FF") return `rgba(47, 129, 255, 0.3)`;
    hex = hex.replace(/^#/, "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

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
        // Handle expanded skill
        if (isMobile) {
          // Mobile: expand to full width (2x1)
          gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 3`;
        } else {
          // Desktop: expand to 2x2
          if (clickedCol === 1) {
            gridArea = `${clickedRow} / 1 / ${clickedRow + 2} / 3`;
          } else {
            gridArea = `${clickedRow} / 2 / ${clickedRow + 2} / 4`;
          }
        }
      } else {
        // Handle non-expanded skills
        if (isMobile) {
          // Mobile (2-column) layout
          const currentRow = Math.floor(index / columns) + 1;
          
          if (currentRow === clickedRow) {
            // Same row as clicked item - push to next row
            gridArea = `${clickedRow + 1} / 1 / ${clickedRow + 2} / 2`;
          } else if (currentRow > clickedRow) {
            // Rows after the clicked row - push down by 1 row
            if (originalCol == 1) {
              gridArea = `${currentRow} / 2 / ${currentRow + 1} / 3`;
            } else {
              gridArea = `${currentRow + 1} / 1 / ${currentRow + 2} / 2`;
            }
          }
        } else {
          // Desktop (3-column) layout
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
        description={skill.description}
        showDescription={clickedIndex === index}
        onClick={() => {
          setClickedIndex(clickedIndex === index ? null : index);
          setBackgroundColor(hexToRgba(skill.image.backgroundColor, 0.3));
        }}
        className={`${styles.skill} ${
          clickedIndex === index ? styles.clicked : ""
        }`}
      />
    );
  });
};

  return (
    <div className={styles.skills} style={{ backgroundColor: backgroundColor }}>
      {type === "mobile" && (
        <div className={styles.mobile}>
          {renderSkills(
            mobile,
            clickedMobileIndex,
            setMobileClickedIndex,
            isMobile
          )}
        </div>
      )}
      {type === "frontend" && (
        <div className={styles.frontend}>
          {renderSkills(
            frontend,
            clickedFrontendIndex,
            setFrontendClickedIndex,
            isMobile
          )}
        </div>
      )}
      {type === "backend" && (
        <div className={styles.backend}>
          {renderSkills(
            backend,
            clickedBackendIndex,
            setBackendClickedIndex,
            isMobile
          )}
        </div>
      )}
      {type === "database" && (
        <div className={styles.database}>
          {renderSkills(
            database,
            clickedDatabaseIndex,
            setDatabaseClickedIndex,
            isMobile
          )}
        </div>
      )}
      {type === "cloud" && (
        <div className={styles.cloud}>
          {renderSkills(
            cloud,
            clickedCloudIndex,
            setCloudClickedIndex,
            isMobile
          )}
        </div>
      )}
      {type === "miscellaneous" && (
        <div className={styles.miscellaneous}>
          {renderSkills(
            miscellaneous,
            clickedMiscellaneousIndex,
            setMiscellaneousClickedIndex,
            isMobile
          )}
        </div>
      )}
      <Scrubber type={type} setType={setType} />
    </div>
  );
};

export default Skills;
