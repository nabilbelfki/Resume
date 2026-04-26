import React from "react";
import Image from "next/image";
import styles from "./Biography.module.css";
import SocialLink from "@/components/Mobile/SocialLink/SocialLink";
import { socialLinks } from '@/components/Mobile/SocialLink/SocialLinks';

interface BiographyProps {
  mode?: 'compact' | 'expanded';
}

const Biography: React.FC<BiographyProps> = ({ mode = 'compact' }) => {
  return (
    <div id={mode === 'compact' ? "biography" : "biography-expanded"} className={`${styles.biography} ${styles[mode]}`}>
      <div className={styles[`paint-spackle`]}>
        <div className={styles[`profile-description-and-socials`]}>
          <div className={styles[`profile`]}>
            <div className={styles[`profile-image-area`]}>
              <Image src="/images/profile.png" alt="Profile Picture of Myself" width={225} height={225} className={styles[`profile-image`]}/>
            </div>
            <div className={styles[`name-and-title`]}>
              <div className={styles.name}>Nabil Belfki</div>
              <div className={styles.title}>Software Engineer</div>
            </div>
          </div>
          <div className={styles[`description-and-socials`]}>
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
            <div className={styles[`description`]}>
              {mode === 'compact' ? (
                "There is nothing that I can't do or accomplish. I am a great asset to a team and company. I've transformed countless..."
              ) : (
                "There is nothing that I can't do or accomplish. I am a great asset to a team and company. I've transformed countless clients in my career by helping them automate processes and solve their problems. I'm code agnostic having wrote projects in many different stacks. I have knowledge in many different sectors from the flight industry to banking and finance to e-commerce."
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography;
