import React from "react";
import Image from "next/image";
import styles from "./Slide.module.css";

interface SlideProps {
  name: string;
  color: string;
  image: string;
  url: string;
  width: number;
}

const Slide: React.FC<SlideProps> = ({ name, color, image, url, width }) => {
  return (
    <a
      href={url}
      target="_blank"
      className={styles.slide}
      style={{ backgroundColor: color, minWidth: width }}
    >
      <Image src={image} alt={name} width="200" height="300" />
    </a>
  );
};

export default Slide;
