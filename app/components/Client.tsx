import React from "react";
import Image from "next/image";
import Slideshow from "./Slideshow";
import styles from "./Client.module.css";
import { Client as ClientType } from "./types";

interface ClientProps {
  client: ClientType;
}

const Client: React.FC<ClientProps> = ({ client }) => {
  console.log("Client", client);
  return (
    <div className={styles.overlay}>
      <div className={styles["about-client"]}>
        <div className={styles["client-title"]}>
          <div className={styles["client-title-icon"]}>
            <Image
              src={`${client.logo.path}${client.logo.fileName}`}
              alt={`${client.title.name} Logo`}
              width={client.logo.width}
              height={client.logo.height}
            />
          </div>
          <div
            className={styles["client-title-text"]}
            style={{ fontSize: client.title.fontSize }}
          >
            {client.title.name}
          </div>
        </div>
        <div className={styles["client-description"]}>{client.description}</div>
        <Slideshow slides={client.slides} />
      </div>
    </div>
  );
};

export default Client;
