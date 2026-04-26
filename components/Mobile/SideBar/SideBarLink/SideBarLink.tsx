import React from "react";
import styles from "./SideBarLink.module.css";
import { icons } from '../icons';

type IconKeys = keyof typeof icons;

interface SideBarLinkProps {
    label: IconKeys;
    expanded: boolean; // We still need this prop to control the label's styles
}

const SideBarLink: React.FC<SideBarLinkProps> = ({ label, expanded }) => {
    // Apply the 'expanded' class to the container as before
    const containerClassName = expanded ? `${styles.container} ${styles.expanded}` : styles.container;

    return (
        <a className={containerClassName} href={"/admin/" + label.toLowerCase()}>
            <div className={styles.icon}>
                {icons[label]}
            </div>
            {/* 1. Always render the span */}
            {/* 2. Conditionally apply a class to the span itself based on 'expanded' */}
            <span className={`${styles.label} ${expanded ? styles.labelVisible : ''}`}>
                {label}
            </span>
        </a>
    )
}

export default SideBarLink;