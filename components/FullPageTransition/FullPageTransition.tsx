"use client";
import React, { useEffect, useRef } from "react";

const FullPageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null, // use the viewport
      threshold: 0.4, // trigger when 40% of the section is visible
      rootMargin: "-90px 0px 0px 0px", // Align with the fixed header
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-focused");
        } else {
          entry.target.classList.remove("section-focused");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Initial check for all target sections
    const targetSelectors = ["#biography", ".experience-and-skills", ".skills-display", ".projects-display", ".contact-and-schedule-meeting"];
    
    // We need to poll or use a slight delay because Next.js hydration might not have rendered all IDs yet
    const timeoutId = setTimeout(() => {
      targetSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => observer.observe(el));
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return <div className="full-page-wrapper">{children}</div>;
};

export default FullPageTransition;
