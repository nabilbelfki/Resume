import React from "react";
import Image from "next/image";
import styles from "./Biography.module.css";
import SocialLink from "@/components/SocialLink/SocialLink";
import { socialLinks } from '@/components/SocialLink/SocialLinks';

const Biography: React.FC = ({}) => {
  return (
    <div id="biography" className={styles.biography}>
      <div className={styles[`languages`]}>
        {/* <Image src="/images/languages.svg" alt="Hello in many modern languages" width="360" height="360" className={styles[`languages-image`]}/> */}
      </div>
      <div className={styles[`paint-spackle`]}>
        <Image src="/images/paint-spackle.svg" alt="White paint spackle pattern" width="1000" height="550" className={styles[`paint-spackle-image`]}/>
        <div className={styles[`profile-description-and-socials`]}>
          <div className={styles[`profile`]}>
            <div className={styles[`profile-image-area`]}>
              <Image src="/images/profile.png" alt="Profile Picture of Myself" width="225" height="225" className={styles[`profile-image`]}/>
            </div>
            <div className={styles[`name-and-title`]}>
              <div className={styles.name}>Nabil Belfki</div>
              <div className={styles.title}>Software Engineer</div>
            </div>
          </div>
          <div className={styles[`description-and-socials`]}>
            <div className={styles[`description`]}>
              Let’s bring your vision to life and transform your goals into accomplishments. With over half a decade of experience in software development, I am here to support you with my vast skillset and talents. Whether you need a custom software development, web application, mobile application, AI/ML solution or seamless integration, I am here to help you meet your business needs. If you would like to learn more you can either send me a message or schedule a meeting so we can talk.
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
      </div>
    </div>
  );
};

export default Biography;
