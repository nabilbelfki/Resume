import React from 'react';
import NavigationLink from './NavigationLink';
import styles from './NavigationBar.module.css';

const NavigationBar: React.FC = () => {
    return (
        <nav className={styles.nav}>
            <ul>
                <NavigationLink href="/biography" label="Biography" />
                <NavigationLink href="/experience" label="Experience" />
                <NavigationLink href="/skills" label="Skills" />
                <NavigationLink href="/projects" label="Projects" />
                <NavigationLink href="/contact" label="Contact" />
            </ul>
        </nav>
    );
};

export default NavigationBar;
