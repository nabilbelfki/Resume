"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.content}>
          <h1 className={styles.status}>404</h1>
          <h2 style={{ color: "#FFF", fontSize: "40px" }}>Ooops, this page doesn&lsquo;t exist. <br />Must have gotten lost somewhere in space.</h2>
          <Link href="/">
            <button className={styles.backButton}>Back to Earth</button>
          </Link>
        </div>
        <Image className={styles.astronaut} src="/images/404/Astronaut.png" alt="Astronaut" height={500} width={500} />
        <Image className={styles.meteor} src="/images/404/Meteor.png" alt="Meteor" height={500} width={500} />
        <Image className={styles.iss} src="/images/404/International Space Station.png" alt="ISS" height={900} width={900} />
        <Image className={styles.saturn} src="/images/404/Saturn.png" alt="Saturn" height={500} width={500} />
      </div>
    </div>
  );
};

export default NotFound;
