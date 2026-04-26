import React, { useEffect, useState } from "react";
import styles from "./Loading.module.css";

interface LoadingProps {
  isLoading: boolean;
  zIndex: number;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, zIndex }) => {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setActiveDot((prev) => (prev + 1) % 3);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div className={styles["loading-container"]} style={{ display: isLoading ? "flex" : "none", zIndex: zIndex }}>
      <div className={styles["three-dots"]}>
        <div className={`${styles["dot"]} ${activeDot === 0 ? styles["active"] : ""}`}></div>
        <div className={`${styles["dot"]} ${activeDot === 1 ? styles["active"] : ""}`}></div>
        <div className={`${styles["dot"]} ${activeDot === 2 ? styles["active"] : ""}`}></div>
      </div>
    </div>
  );
};

export default Loading;
