import React from "react";
import Image from "next/image";
import styles from "./PictureLink.module.css";

interface PictureLinkProps {
  image: string;
  link: string;
  shortLink: string;
  name: string;
  color: string;
}

const PictureLink: React.FC<PictureLinkProps> = ({
  image,
  link,
  shortLink,
  name,
  color,
}) => {
  return (
    <a
      className={styles["picture-link"]}
      href={link}
      style={{ backgroundColor: color }}
      target="_blank"
    >
      <div className={styles.icon}>
        <Image src={image} alt={name} />
      </div>
      <div className={styles["name-and-link"]}>
        <div className={styles.link}>{shortLink}</div>
        <div className={styles.name}>{name}</div>
      </div>
    </a>
  );
};

export default PictureLink;
