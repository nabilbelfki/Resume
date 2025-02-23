import React from "react";
import Image from "next/image";
import Slideshow from "./Slideshow";
import styles from "./Client.module.css";

const Client = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles["about-client"]}>
        <div className={styles["client-title"]}>
          <div className={styles["client-title-icon"]}>
            <Image
              src="/images/logos/hasbro.png"
              alt="Hasbro Inc. Logo"
              width={40}
              height={40}
            />
          </div>
          <div className={styles["client-title-text"]}>Hasbro Inc.</div>
        </div>
        <div className={styles["client-description"]}>
          Hasbro, Inc. is a leading global play and entertainment company
          committed to creating the world’s best play experiences. Founded in
          1923 and headquartered in Pawtucket, Rhode Island, Hasbro designs and
          produces a wide range of toys, games, and entertainment products. The
          company’s portfolio includes iconic brands such as NERF, My Little
          Pony, Transformers, Play-Doh, Monopoly, and Magic: The Gathering.
        </div>
        <Slideshow />
      </div>
    </div>
  );
};

export default Client;
