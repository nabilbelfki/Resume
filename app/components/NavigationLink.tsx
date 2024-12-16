// components/NavigationLink.tsx
import React from 'react';
import Link from 'next/link';
import styles from './NavigationLink.module.css';

interface NavigationLinkProps {
    href: string;
    label: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ href, label }) => {
    return (
        <li>
            <Link href={href} legacyBehavior>
                <a className={styles.link}>{label}</a>
            </Link>
        </li>
    );
};

export default NavigationLink;
