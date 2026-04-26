"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Experiences, Project, Skill } from "@/lib/types";

// Desktop Components
import Biography from "@/components/Biography/Biography";
import Timeline from "@/components/Timeline/Timeline";
import ContactForm from "@/components/ContactForm/ContactForm";
import Calendar from "@/components/Calendar/Calendar";
import Skills from "@/components/Skills/Skills";
import ProjectsCarousel from "@/components/ProjectsCarousel/ProjectsCarousel";
import FullPageTransition from "@/components/FullPageTransition/FullPageTransition";

// Mobile Components
import MobileBiography from "@/components/Mobile/Biography/Biography";
import MobileTimeline from "@/components/Mobile/Timeline/Timeline";
import MobileContactForm from "@/components/Mobile/ContactForm/ContactForm";
import MobileCalendar from "@/components/Mobile/Calendar/Calendar";
import MobileSkills from "@/components/Mobile/Skills/Skills";
import MobileProjectsCarousel from "@/components/Mobile/ProjectsCarousel/ProjectsCarousel";

interface ResponsiveHomeProps {
  projects: Project[];
  skills: Skill[];
  experiences: Experiences[];
  settings: {
    siteMaintenance: boolean;
    websiteMessaging: boolean;
    scheduleMeetings: boolean;
  };
}

const ResponsiveHome: React.FC<ResponsiveHomeProps> = ({
  projects,
  skills,
  experiences,
  settings,
}) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent flash of desktop version during hydration
  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="mobile-view">
        <MobileBiography />
        <div id="experiences" className="experience-and-skills">
          <MobileTimeline experiences={experiences} />
        </div>
        <div id="skills-section" className="skills-display">
          <MobileSkills skills={skills} />
        </div>
        <div id="projects" className="projects-display">
          <MobileProjectsCarousel projects={projects} />
        </div>
        {(settings.websiteMessaging || settings.scheduleMeetings) && (
          <div className="contact-and-schedule-meeting">
            {settings.websiteMessaging && <MobileContactForm />}
            {settings.scheduleMeetings && (
              <div id="meeting" className="title-and-calendar">
                <div className="calendar-title">Schedule a Meeting</div>
                <MobileCalendar />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <FullPageTransition>
      <Biography />
      <div id="experiences" className="experience-and-skills">
        <Timeline experiences={experiences} />
      </div>
      <div id="skills-section" className="skills-display">
        <Skills skills={skills} />
      </div>
      <div id="projects" className="projects-display">
        <ProjectsCarousel projects={projects} />
      </div>
      {(settings.websiteMessaging || settings.scheduleMeetings) && (
        <div className="contact-and-schedule-meeting">
          <div className="contact-header">
            <div className="profileWrapper">
              <Image
                src="/images/profile.png"
                alt="Nabil Belfki"
                width={225}
                height={225}
                className="profileImage"
              />
            </div>
            <div className="heroText">
              <h1>Get In Touch With Me</h1>
              <p>
                If you want to connect with me just schedule a meeting and let's talk about whatever your heart desires. Or just send me a message too and I usually respond quickly. Don't hesitate to reach out!
              </p>
            </div>
          </div>
          <div className="contact-content-wrapper">
            {settings.websiteMessaging && <ContactForm />}
            {settings.scheduleMeetings && (
              <div id="meeting" className="title-and-calendar">
                <div className="calendar-title">Schedule a Meeting</div>
                <Calendar />
              </div>
            )}
          </div>
        </div>
      )}
    </FullPageTransition>
  );
};

export default ResponsiveHome;
