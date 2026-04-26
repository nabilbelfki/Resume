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
import MobileExperienceDetail from "@/components/Mobile/Experience/ExperienceDetail";

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
      <FullPageTransition>
        <div id="biography" className="snap-section">
          <MobileBiography mode="compact" />
        </div>
        <div id="biography-expanded" className="snap-section">
          <MobileBiography mode="expanded" />
        </div>
        <div id="experience-timeline" className="snap-section">
          <div className="experience-and-skills" style={{ height: '100%' }}>
            <MobileTimeline experiences={experiences} />
          </div>
        </div>
        <div id="skills-section" className="snap-section">
          <div className="skills-display" style={{ height: '100%' }}>
            <MobileSkills skills={skills} />
          </div>
        </div>
        <div id="projects" className="snap-section">
          <div className="projects-display" style={{ height: '100%' }}>
            <MobileProjectsCarousel projects={projects} />
          </div>
        </div>
        {settings.scheduleMeetings && (
          <div id="meeting" className="snap-section">
            <div className="title-and-calendar" style={{ height: '100%', justifyContent: 'center' }}>
              <div className="calendar-title" style={{ padding: '0 20px' }}>Schedule a Meeting</div>
              <MobileCalendar />
            </div>
          </div>
        )}
        {settings.websiteMessaging && (
          <div id="contact" className="snap-section">
            <MobileContactForm />
          </div>
        )}
      </FullPageTransition>
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
