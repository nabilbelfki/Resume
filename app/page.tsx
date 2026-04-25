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

  // Intercept the entire application render if Maintenance mode is active
  if (settings.siteMaintenance) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--text)' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-1px' }}>Site Under Maintenance</h1>
        <p style={{ fontSize: '1.2rem', color: '#888' }}>We are currently applying updates. Check back shortly.</p>
      </div>
    );
  }

  return (
    <div>
      <Biography/>
      <div id="experiences" className="experience-and-skills">
        <Timeline experiences={experiences} />
        <div id="skills" className="skills-display">
          <div className="skills-title-and-description unselected">
            <div className="metal">
              <Image src="/images/metal.jpg" alt="" width="200" height="300" />
            </div>
            <div className="skills-title">SKILLS</div>
            <div className="skills-description">
              These are the skills that I have accumulated over the years. They
              have helped shaped me into an esteemed developer and contribute to
              many companies success.
            </div>
            <div className="screw-one">
              <svg
                width="10"
                height="10"
                viewBox="0 0 4 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="2"
                  cy="2"
                  r="1.95"
                  fill="#BDBDBD"
                  stroke="#2E2E2E"
                  strokeWidth="0.1"
                />
                <rect
                  x="2.67175"
                  y="1.25751"
                  width="0.1"
                  height="2"
                  rx="0.05"
                  transform="rotate(45 2.67175 1.25751)"
                  fill="#2E2E2E"
                />
                <rect
                  x="2.74243"
                  y="2.67175"
                  width="0.1"
                  height="2"
                  rx="0.05"
                  transform="rotate(135 2.74243 2.67175)"
                  fill="#2E2E2E"
                />
              </svg>
            </div>
            <div className="screw-two">
              <svg
                width="10"
                height="10"
                viewBox="0 0 4 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="2"
                  cy="2"
                  r="1.95"
                  fill="#BDBDBD"
                  stroke="#2E2E2E"
                  strokeWidth="0.1"
                />
                <rect
                  x="2.67175"
                  y="1.25751"
                  width="0.1"
                  height="2"
                  rx="0.05"
                  transform="rotate(45 2.67175 1.25751)"
                  fill="#2E2E2E"
                />
                <rect
                  x="2.74243"
                  y="2.67175"
                  width="0.1"
                  height="2"
                  rx="0.05"
                  transform="rotate(135 2.74243 2.67175)"
                  fill="#2E2E2E"
                />
              </svg>
            </div>
            <div className="screw-three">
              <svg
                width="10"
                height="10"
                viewBox="0 0 4 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="2"
                  cy="2"
                  r="1.95"
                  fill="#BDBDBD"
                  stroke="#2E2E2E"
                  strokeWidth="0.1"
                />
                <rect
                  x="2.67175"
                  y="1.25751"
                  width="0.1"
                  height="2"
                  rx="0.05"
                  transform="rotate(45 2.67175 1.25751)"
                  fill="#2E2E2E"
                />
                <rect
                  x="2.74243"
                  y="2.67175"
                  width="0.1"
                  height="2"
                  rx="0.05"
                  transform="rotate(135 2.74243 2.67175)"
                  fill="#2E2E2E"
                />
              </svg>
            </div>
            <div className="screw-four">
              <svg
                width="10"
                height="10"
                viewBox="0 0 4 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="2"
                  cy="2"
                  r="1.95"
                  fill="#BDBDBD"
                  stroke="#2E2E2E"
                  strokeWidth="0.1"
                />
                <rect
                  x="2.67175"
                  y="1.25751"
                  width="0.1"
                  height="2"
                  rx="0.05"
                  transform="rotate(45 2.67175 1.25751)"
                  fill="#2E2E2E"
                />
                <rect
                  x="2.74243"
                  y="2.67175"
                  width="0.1"
                  height="2"
                  rx="0.05"
                  transform="rotate(135 2.74243 2.67175)"
                  fill="#2E2E2E"
                />
              </svg>
            </div>
          </div>
          <Skills skills={skills} />
        </div>
      </div>
      <div id="projects" className="projects-display">
        <ProjectsCarousel projects={projects} />
      </div>
      {(settings.websiteMessaging || settings.scheduleMeetings) && (
        <div className="contact-and-schedule-meeting">
          {settings.websiteMessaging && <ContactForm/>}
          {settings.scheduleMeetings && (
            <div id="meeting" className="title-and-calendar">
              <div className="calendar-title">Schedule a Meeting</div>
              <Calendar />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
