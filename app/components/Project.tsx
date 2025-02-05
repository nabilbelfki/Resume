import React from "react";
import styles from "./Project.module.css";

interface ProjectProps {
  name: string;
  videoPath: string;
}

const Project: React.FC<ProjectProps> = ({ name, videoPath }) => {
  return (
    <div className={styles.project}>
      <div className={styles.preview}>{name}</div>
      <img src={videoPath} alt="Project Preview GIF" className={styles.gif} />
    </div>
  );
};

export default Project;
