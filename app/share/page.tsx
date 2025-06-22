import React from "react";
import QRCode from "../components/QRCode";
import styles from "./Share.module.css";
import SocialLink from "../components/SocialLink";
import { socialLinks } from "../components/SocialLinks";

const Share: React.FC = () => {

  return (
    <>
      <div className={styles.share}>
        <div className={styles.profile}>
          <QRCode/>
          <div className={styles['name-and-title']}>
            <div className={styles.name}>Nabil Belfki</div>
            <div className={styles.title}>Software Engineer</div>
          </div>
          <div className={styles[`socials`]}>
              {socialLinks.map((socialLink, index) => (
                <SocialLink
                  key={index}
                  title={socialLink.title}
                  link={socialLink.link}
                  icon={socialLink.icon}
                />
              ))}
            </div>
        </div>

      </div>
    </>
  );
};

export default Share;
