import React, { useState } from "react";
import styles from "./SideBar.module.css";
import SideBarLink from "./SideBarLink/SideBarLink";
import { icons } from './icons';

type IconKeys = keyof typeof icons;

const SideBar: React.FC = () => {
    const [expanded, setExpanded] = useState(false);

    const links: IconKeys[] = Object.keys(icons) as IconKeys[];

    return (
        <div
            className={`${styles.sidebar} ${expanded ? styles.expanded : ''}`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            {links.map((link, index) => (
                <SideBarLink key={'sidebar-item-' + index} label={link} expanded={expanded} /> // <-- Pass 'expanded'
            ))}
        </div>
    );
}

export default SideBar;