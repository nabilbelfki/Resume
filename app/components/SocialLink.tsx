import React from "react";
import Image from "next/image";
import styles from "./SocialLink.module.css";


interface Title {
  text: string;
  color: string;
  backgroundColor: string;
}

interface Link {
  color: string;
  text: string;
  backgroundColor: string;
  href: string;
}

interface Icon {
  width: string;
  height: string;
  path: string;
  alt: string;
}

interface SocialLinkProps {
  title: Title;
  link: Link;
  icon: Icon;
}

const SocialLink: React.FC<SocialLinkProps> = ({
  title,
  link,
  icon
}) => {
  return (
    <div id="biography" className={styles.biography}>
      
    </div>
  );
};

export default SocialLink;
