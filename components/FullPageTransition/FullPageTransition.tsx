"use client";
import React, { useEffect, useRef } from "react";

const FullPageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null, // use the viewport
      threshold: 0.4, // trigger when 40% of the section is visible
      rootMargin: "0px", // No more offset needed as header is hidden on scroll
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-focused");
          // Dispatch a custom event to notify other components (like NavigationBar)
          window.dispatchEvent(new CustomEvent("section-focused", { 
            detail: { 
              id: entry.target.id,
              className: entry.target.className
            } 
          }));
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
