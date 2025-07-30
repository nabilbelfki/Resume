import React from "react";
import styles from "./AvatarUpload.module.css"

const AvatarUpload: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.thumbnail}>
                <span className={styles.initials}>NB</span>
            </div>
            <button className={styles.edit}>Edit</button>
        </div>
    );
};  

export default AvatarUpload;