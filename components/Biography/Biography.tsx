import React from "react";
import Image from "next/image";
import styles from "./Biography.module.css";
import SocialLink from "@/components/SocialLink/SocialLink";
import { socialLinks } from '@/components/SocialLink/SocialLinks';
import CodeMatrix from "@/components/CodeMatrix/CodeMatrix";

const Biography: React.FC = ({ }) => {
  return (
    <div id="biography" className={styles.biography}>
      <CodeMatrix />
      <div className={styles[`paint-spackle`]}>
        <div className={styles.flipCard}>
          <div className={styles.flipCardInner}>
            {/* Front Side: Profile */}
            <div className={`${styles.profileDescriptionAndSocials} ${styles.flipCardFront}`}>
              <div className={styles[`profile`]}>
                <div className={styles[`profile-image-area`]}>
                  <Image src="/images/profile.png" alt="Profile Picture of Myself" width="225" height="225" className={styles[`profile-image`]} />
                </div>
                <div className={styles[`name-and-title`]}>
                  <div className={styles.name}>Nabil Belfki</div>
                  <div className={styles.title}>Software Engineer</div>
                </div>
              </div>
              <div className={styles.flipHint}>Hover to see more</div>
            </div>

            {/* Back Side: Description and Socials */}
            <div className={`${styles.profileDescriptionAndSocials} ${styles.flipCardBack}`}>
              <div className={styles[`description-and-socials`]}>
                <div className={styles[`description`]}>
                  "There is nothing that I can't do or accomplish. I'm a great asset to a team and company. I've transformed countless clients in my career by helping them automate processes and solve their problems. I'm code agnostic haven write projects in many different stacks. I have knowledge in many different sectors from the flight industry to banking and finance to e-commerce."
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
      </div>
    </div>
  );
};

export default Biography;
