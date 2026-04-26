"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
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
  const [type, setType] = useState("all");
  const [backgroundColor, setBackgroundColor] = useState("rgba(90, 90, 90, 0.05)");
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const [isTablet, setIsTablet] = useState(
    typeof window !== 'undefined' ? (window.innerWidth > 768 && window.innerWidth <= 1200) : false
  );
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // State for expanded skills
  const [clickedAllIndex, setAllClickedIndex] = useState<number | null>(null);
  const [clickedMobileIndex, setMobileClickedIndex] = useState<number | null>(null);
  const [clickedFrontendIndex, setFrontendClickedIndex] = useState<number | null>(null);
  const [clickedBackendIndex, setBackendClickedIndex] = useState<number | null>(null);
  const [clickedDatabaseIndex, setDatabaseClickedIndex] = useState<number | null>(null);
  const [clickedCloudIndex, setCloudClickedIndex] = useState<number | null>(null);
  const [clickedMiscellaneousIndex, setMiscellaneousClickedIndex] = useState<number | null>(null);

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
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update background color when type changes
  useEffect(() => {
    const currentSkills = 
      type === "all" ? skills :
      type === "mobile" ? mobile :
      type === "frontend" ? frontend :
      type === "backend" ? backend :
      type === "database" ? database :
      type === "cloud" ? cloud :
      miscellaneous;
    
    if (currentSkills.length > 0) {
      setBackgroundColor(hexToRgba(currentSkills[0].image.backgroundColor, 0.2));
    }
  }, [type, skills, mobile, frontend, backend, database, cloud, miscellaneous]);

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
    skillsList: Skill[],
    clickedIndex: number | null,
    setClickedIndex: React.Dispatch<React.SetStateAction<number | null>>,
    isMobile: boolean,
    isTablet: boolean,
    isVisible: boolean
  ) => {
    const columns = isMobile ? 2 : (isTablet ? 4 : 6);

    return skillsList.map((skill, index) => {
      const row = Math.floor(index / columns) + 1;
      const col = (index % columns) + 1;
      const startCol = col === columns ? Math.max(1, columns - 1) : col;
      const gridArea = `${row} / ${startCol} / span 2 / span 2`;

      return (
        <Skill
          key={index}
          index={index}
          gridArea={gridArea}
          isMobile={isMobile}
          image={skill.image}
          name={skill.name}
          description={skill.description}
          showDescription={clickedIndex === index}
          isVisible={isVisible}
          onMouseEnter={() => {
            setClickedIndex(index);
            setBackgroundColor(hexToRgba(skill.image.backgroundColor, 0.2));
          }}
          onClick={() => {}} 
          className={`${styles.skill} ${clickedIndex === index ? styles.clicked : ""} ${isVisible ? styles.revealed : ""}`}
        />
      );
    });
  };

  return (
    <div 
      ref={containerRef} 
      className={`${styles.container} ${!isVisible ? styles.paused : ""}`}
    >
      <div className={styles.skills} style={{ backgroundColor }}>
        {type === "all" && (
          <div className={styles.all} onMouseLeave={() => setAllClickedIndex(null)}>
            {renderSkills(skills, clickedAllIndex, setAllClickedIndex, isMobile, isTablet, isVisible)}
          </div>
        )}
        {type === "mobile" && (
          <div className={styles.mobile} onMouseLeave={() => setMobileClickedIndex(null)}>
            {renderSkills(mobile, clickedMobileIndex, setMobileClickedIndex, isMobile, isTablet, isVisible)}
          </div>
        )}
        {type === "frontend" && (
          <div className={styles.frontend} onMouseLeave={() => setFrontendClickedIndex(null)}>
            {renderSkills(frontend, clickedFrontendIndex, setFrontendClickedIndex, isMobile, isTablet, isVisible)}
          </div>
        )}
        {type === "backend" && (
          <div className={styles.backend} onMouseLeave={() => setBackendClickedIndex(null)}>
            {renderSkills(backend, clickedBackendIndex, setBackendClickedIndex, isMobile, isTablet, isVisible)}
          </div>
        )}
        {type === "database" && (
          <div className={styles.database} onMouseLeave={() => setDatabaseClickedIndex(null)}>
            {renderSkills(database, clickedDatabaseIndex, setDatabaseClickedIndex, isMobile, isTablet, isVisible)}
          </div>
        )}
        {type === "cloud" && (
          <div className={styles.cloud} onMouseLeave={() => setCloudClickedIndex(null)}>
            {renderSkills(cloud, clickedCloudIndex, setCloudClickedIndex, isMobile, isTablet, isVisible)}
          </div>
        )}
        {type === "miscellaneous" && (
          <div className={styles.miscellaneous} onMouseLeave={() => setMiscellaneousClickedIndex(null)}>
            {renderSkills(miscellaneous, clickedMiscellaneousIndex, setMiscellaneousClickedIndex, isMobile, isTablet, isVisible)}
          </div>
        )}
        <Scrubber type={type} setType={setType} />
      </div>
    </div>
  );
};

export default Skills;