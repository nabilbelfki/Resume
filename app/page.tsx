import Link from "next/link";
import React from "react";
import Image from "next/image";
import Biography from "@/components/Biography/Biography";
import Timeline from "@/components/Timeline/Timeline";
import ContactForm from "@/components/ContactForm/ContactForm";
import Calendar from "@/components/Calendar/Calendar";
import Skills from "@/components/Skills/Skills";
import ProjectsCarousel from "@/components/ProjectsCarousel/ProjectsCarousel";
import { Experiences, Project, Skill } from "../lib/types";
import FullPageTransition from "@/components/FullPageTransition/FullPageTransition";

const Home = async () => {
  let projects: Project[] = [];
  let skills: Skill[] = [];
  let experiences: Experiences[] = [];
  let settings = {
    siteMaintenance: false,
    websiteMessaging: true, // Default open 
    scheduleMeetings: true
  };

  // Define your local API base URL
  // It's good practice to use an environment variable for this
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  try {
    const [projectsRes, skillsRes, experiencesRes, settingsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/projects?status=Active`, { // Use absolute URL
        next: { revalidate: 60 },
      }),
      fetch(`${API_BASE_URL}/api/skills?status=Active`, { // Use absolute URL
        next: { revalidate: 60 },
      }),
      fetch(`${API_BASE_URL}/api/experiences?status=Active`, { // Use absolute URL
        next: { revalidate: 60 },
      }),
      fetch(`${API_BASE_URL}/api/settings`, {
        cache: 'no-store'
      }),
    ]);

    if (projectsRes.ok) {
      const projectsData = await projectsRes.json();
      projects = projectsData.data;
    } else {
      console.error("Failed to fetch projects:", projectsRes.statusText);
    }

    if (skillsRes.ok) {
      const skillsData = await skillsRes.json();
      skills = skillsData.data;
    } else {
      console.error("Failed to fetch skills:", skillsRes.statusText);
    }

    if (experiencesRes.ok) {
      const experiencesData = await experiencesRes.json();
      experiences = experiencesData.data;
    } else {
      console.error("Failed to fetch experiences:", experiencesRes.statusText);
    }

    if (settingsRes.ok) {
      const settingsData = await settingsRes.json();
      if (settingsData.data) {
        settings = settingsData.data;
      }
    } else {
      console.error("Failed to fetch settings:", settingsRes.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
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

export default Home;
