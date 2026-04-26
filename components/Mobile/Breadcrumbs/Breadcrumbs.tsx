import React from "react";
import styles from "./Breadcrumbs.module.css";
import { icons } from "../SideBar/icons";
import { Breadcrumb } from "@/lib/types";

type IconKey = keyof typeof icons;

interface BreadcrumbsProps {
    breadcrumbs: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
    const icon: IconKey = breadcrumbs[0].label as IconKey;
    const pageName = breadcrumbs[breadcrumbs.length - 1].label === 'Home' ? 'Dashboard' : breadcrumbs[breadcrumbs.length - 1].label;
    return (
        <div className={styles.container}>
            <div className={styles.title}>{ pageName }</div>
            <div className={styles.breadcrumbs}>{
            breadcrumbs.map((breadcrumb, index) =>
                (<a key={'breadcrumb-' + index} className={styles['icon-and-link']} href={breadcrumb.href}>
                    <div className={styles.icon}>
                        {index === 0 
                        ? 
                        (icons[icon]) 
                        : 
                        (<svg xmlns="http://www.w3.org/2000/svg" version="1.0"height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="var(--breadcrumbs-icon)" stroke="none">
                            <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
                            </g>
                        </svg>)}
                    </div>
                    <div className={styles.label}>{breadcrumb.label}</div>
                </a>)
            )}</div>
        </div>
    );
};

export default Breadcrumbs;