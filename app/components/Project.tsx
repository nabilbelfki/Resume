import React from "react";
import styles from "./Project.module.css";

interface ProjectProps {
    videoPath: string;
}

const Project: React.FC<ProjectProps> = ({ videoPath }) => {
  return (
    <div className={styles.project}>
      <img src={videoPath} alt="Project Preview GIF" className={styles.gif} />
    </div>
  );
};

export default Project;
