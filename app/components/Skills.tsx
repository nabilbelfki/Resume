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
  const [backgroundColor, setbackgroundColor] = useState(
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
    // Remove the hash at the start if it's there
    if (hex == "#FFFFFF") return `rgba(96, 96, 96, 0.1)`;
    if (hex == "#EAF9FF") return `rgba(47, 129, 255, 0.3)`;
    hex = hex.replace(/^#/, "");

    // Parse the r, g, b values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return the RGBA color
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const renderSkills = (
    skills: Skill[],
    clickedIndex: number | null,
    setClickedIndex: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const columns = isMobile ? 2 : 3;

    return skills.map((skill, index) => {
      const row = Math.floor(index / columns) + 1;
      const column = (index % columns) + 1;
      let gridArea = `${row} / ${column} / ${row + 1} / ${column + 1}`;

      if (clickedIndex !== null) {
        const clickedRow = Math.floor(clickedIndex / columns) + 1;
        const clickedColumn = (clickedIndex % columns) + 1;

        if (clickedIndex === index) {
          if (isMobile) {
            if (clickedColumn === 1) {
              gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 3`;
            } else if (clickedColumn === 2) {
              gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 3`;
            }
          } else {
            if (clickedColumn === 1) {
              gridArea = `${clickedRow} / 1 / ${clickedRow + 2} / 3`;
            } else if (clickedColumn === 2) {
              gridArea = `${clickedRow} / 2 / ${clickedRow + 2} / 4`;
            } else if (clickedColumn === 3) {
              gridArea = `${clickedRow} / 2 / ${clickedRow + 2} / 4`;
            }
          }
        } else if (row === clickedRow || row > clickedRow) {
          if (isMobile) {
            if (clickedColumn === 1 && column === 2) {
              gridArea = `${clickedRow + 1} / 1 / ${clickedRow + 2} / 2`;
            } else if (clickedColumn === 2 && column === 1) {
              gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 2`;
            }
          } else {
            if (clickedColumn === 1) {
              if (column === 2) {
                gridArea = `${clickedRow} / 3 / ${clickedRow + 1} / 4`;
              } else if (column === 3) {
                gridArea = `${clickedRow + 1} / 3 / ${clickedRow + 2} / 4`;
              }
            } else if (clickedColumn === 2) {
              if (column === 1) {
                gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 2`;
              } else if (column === 3) {
                gridArea = `${clickedRow + 1} / 1 / ${clickedRow + 2} / 2`;
              }
            } else if (clickedColumn === 3) {
              if (column === 1) {
                gridArea = `${clickedRow} / 1 / ${clickedRow + 1} / 2`;
              } else if (column === 2) {
                gridArea = `${clickedRow + 1} / 1 / ${clickedRow + 2} / 2`;
              }
            }
          }

          // Add +1 to each row under the clicked item
          if (row > clickedRow) {
            gridArea = `${row + 1} / ${column} / ${row + 2} / ${column + 1}`;
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
            setbackgroundColor(hexToRgba(skill.image.backgroundColor, 0.3));
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
      {type == "mobile" && (
        <div className={styles.mobile}>
          {renderSkills(mobile, clickedMobileIndex, setMobileClickedIndex)}
        </div>
      )}
      {type == "frontend" && (
        <div className={styles.frontend}>
          {renderSkills(
            frontend,
            clickedFrontendIndex,
            setFrontendClickedIndex
          )}
        </div>
      )}
      {type == "backend" && (
        <div className={styles.backend}>
          {renderSkills(backend, clickedBackendIndex, setBackendClickedIndex)}
        </div>
      )}
      {type == "database" && (
        <div className={styles.database}>
          {renderSkills(
            database,
            clickedDatabaseIndex,
            setDatabaseClickedIndex
          )}
        </div>
      )}
      {type == "cloud" && (
        <div className={styles.cloud}>
          {renderSkills(cloud, clickedCloudIndex, setCloudClickedIndex)}
        </div>
      )}
      {type == "miscellaneous" && (
        <div className={styles.miscellaneous}>
          {renderSkills(
            miscellaneous,
            clickedMiscellaneousIndex,
            setMiscellaneousClickedIndex
          )}
        </div>
      )}
      <Scrubber type={type} setType={setType} />
    </div>
  );
};

export default Skills;
