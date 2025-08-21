import React from "react";
import styles from "./TotalCount.module.css";

interface TotalCountProps {
    title: string;
    count: number;
}

const TotalCount: React.FC<TotalCountProps> = ({ title, count }) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.count}>{count}</div>
        </div>
    );
};

export default TotalCount;