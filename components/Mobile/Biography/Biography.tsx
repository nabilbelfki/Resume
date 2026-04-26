"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Biography.module.css";
import SocialLink from "@/components/Mobile/SocialLink/SocialLink";
import { socialLinks } from '@/components/Mobile/SocialLink/SocialLinks';

const Biography: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSectionFocused = (e: any) => {
      const id = e.detail.id;
      if (id === 'biography-hero') {
        setIsVisible(true);
        setIsExpanded(false);
      } else if (id === 'biography-text') {
        setIsVisible(true);
        setIsExpanded(true);
        setHasScrolled(true);
      } else {
        // If we move far away, maybe hide or stay in last state
        // To be safe, let's hide if it's not one of our segments
        const bioSegments = ['biography-hero', 'biography-text'];
        if (!bioSegments.includes(id)) {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('section-focused', handleSectionFocused);
    return () => window.removeEventListener('section-focused', handleSectionFocused);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`${styles.biography} ${isExpanded ? styles.expanded : styles.compact}`}
      style={{ 
        overflowY: isExpanded ? 'auto' : 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10
      }}
      ref={containerRef}
    >
      <div className={styles.scrollContent}>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.profileImageArea}>
              <Image 
                src="/images/profile.png" 
                alt="Nabil Belfki" 
                width={225} 
                height={225} 
                className={styles.profileImage}
              />
            </div>
            <div className={styles.nameAndTitle}>
              <div className={styles.name}>Nabil Belfki</div>
              <div className={styles.title}>Software Developer</div>
            </div>
          </div>
          
          <div className={styles.contentArea}>
            <div className={styles.socialsGrid}>
              {socialLinks.map((socialLink, index) => (
                <SocialLink
                  key={index}
                  title={socialLink.title}
                  link={socialLink.link}
                  icon={socialLink.icon}
                />
              ))}
            </div>
            
            <div className={styles.bioText}>
              There is nothing that I can't do or accomplish. I am a great asset to a team and company. I've transformed countless clients in my career by helping them automate processes and solve their problems. I'm code agnostic having wrote projects in many different stacks. I have knowledge in many different sectors from the flight industry to banking and finance to e-commerce.
            </div>
          </div>
        </div>
        
        {!hasScrolled && (
          <div className={styles.scrollHint}>
            <div className={styles.arrow}>↓</div>
            <span>Scroll for Bio</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Biography;
