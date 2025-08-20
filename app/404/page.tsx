"use client";
import React from "react";
import Image from "next/image";
import styles from "./NotFound.module.css";

const NotFound: React.FC = () => {
  return (<div className={styles.container}>
    <div className={styles.background}></div>
    <div className={styles.foreground}>
      <h1>Ooops!</h1>
      <Image className={styles.astronaut} src="/images/404/Astronaut.png" alt="A picture of an astronaut sitting in nature with trees and mountains in the background and saturn in the sky." height={600} width={600}/>
      <Image className={styles.iss} src="/images/404/International Space Station.png" alt="A picture of an astronaut sitting in nature with trees and mountains in the background and saturn in the sky." height={600} width={600}/>
    </div>
  </div>);
};

export default NotFound;
