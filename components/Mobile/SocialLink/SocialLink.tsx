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
  width: number;
  height: number;
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
    <a href={link.href} target="_blank" style={{ textDecoration: 'none' }}>
        <div className={styles[`social-link`]} style={{backgroundColor: title.backgroundColor}}>
        <div className={styles[`icon-area`]}>  
            <Image width={icon.width} height={icon.height} alt={icon.alt} src={icon.path}/>
        </div>
        <div className={styles[`title-and-link`]}>
            <div className={styles.title} style={{color: title.color}}>
                {title.text}
            </div>
            <div className={styles.link}  style={{color: link.color, backgroundColor: link.backgroundColor}}>
                {link.text}
            </div>
        </div>
        </div>
    </a>
  );
};

export default SocialLink;
