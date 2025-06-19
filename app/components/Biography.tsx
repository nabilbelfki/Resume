import React from "react";
import Image from "next/image";
import styles from "./Biography.module.css";
import SocialLink from "./SocialLink";

const Biography: React.FC = ({}) => {
  const socialLinks = [
    {
      title: {
        text: "Personal Github",
        color: "#FFFFFF",
        backgroundColor: "#2E2E2E",
      },
      link: {
        color: "#FFFFFF",
        text: "www.github.com/nabilbelfki",
        backgroundColor: "rgba(255,255,255,0.3)",
        href: "https://www.github.com/nabilbelfki"
      },
      icon: {
        width: 30,
        height: 30,
        path: "/images/github-cat.svg",
        alt: "Github Logo"
      }
    },
    {
      title: {
        text: "Personal Docker",
        color: "#FFFFFF",
        backgroundColor: "#127EC0",
      },
      link: {
        color: "#FFFFFF",
        text: "hub.docker.com/r/nabilbelfki",
        backgroundColor: "rgba(255,255,255,0.3)",
        href: "https://hub.docker.com/r/nabilbelfki"
      },
      icon: {
        width: 30,
        height: 30,
        path: "/images/docker-whale.svg",
        alt: "Docker Logo"
      }
    },
    {
      title: {
        text: "Email Address",
        color: "#5D5D5D",
        backgroundColor: "#FFFFFF",
      },
      link: {
        color: "#FFFFFF",
        text: "info@nabilbelfki.com",
        backgroundColor: "#5D5D5D",
        href: "mailto:info@nabilbelfki.com"
      },
      icon: {
        width: 30,
        height: 30,
        path: "/images/email.svg",
        alt: "Email Envelope Icon"
      }
    },
    {
      title: {
        text: "Linkedin Profile",
        color: "#FFFFFF",
        backgroundColor: "#0E44B9",
      },
      link: {
        color: "#FFFFFF",
        text: "www.linkedin.com/in/nabilbelfki",
        backgroundColor: "rgba(255,255,255,0.3)",
        href: "https://www.linkedin.com/in/nabilbelfki"
      },
      icon: {
        width: 30,
        height: 30,
        path: "/images/linkedin-letters.svg",
        alt: "Linkedin Logo"
      }
    },
  ]

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
