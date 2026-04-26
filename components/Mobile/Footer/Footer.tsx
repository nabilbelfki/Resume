import React from "react";
import NavigationLink from "@/components/Mobile/NavigationBar/NavigationLink/NavigationLink";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {

  const mobileWidth = 640;
  const screenWidth = window.innerWidth;

  return (
    <footer className={styles.footer}>
      <ul>
        <NavigationLink href="/" label="Portfolio" />
        <NavigationLink href="/resume" label="Resume" />
        <NavigationLink href="/blog" label="Blog" />
        <NavigationLink href="/contact" label="Contact" />
      </ul>
    </footer>
  );
};

export default Footer;
