import React from "react";
import Image from "next/image";
import styles from "./Slideshow.module.css";

const Slideshow = () => {
  return (
    <div className={styles.slideshow}>
      <div className={styles.slide}>
        <Image
          src="/images/transformers.png"
          alt="Optimus Prime Artwork"
          width={324}
          height={200}
        />
      </div>
    </div>
  );
};

export default Slideshow;
