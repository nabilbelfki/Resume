import React from "react";
import Image from "next/image";
import styles from "./Project.module.css";

interface ProjectProps {
  name: string;
  videoPath: string;
}

const Project: React.FC<ProjectProps> = ({ name, videoPath }) => {
  return (
    <div className={styles.project}>
      <div className={styles.preview}>{name}</div>
      <Image src={videoPath} alt="Project Preview GIF" className={styles.gif} width="200" height="300" />
    </div>
  );
};

export default Project;
