import Link from "next/link";
import React from "react";
import Image from "next/image";
import Biography from "./components/Biography";
import Timeline from "./components/Timeline";
import ContactForm from "./components/ContactForm";
import Calendar from "./components/Calendar";
import Skills from "./components/Skills";
import Project from "./components/Project";
// import axios from "axios";

interface Project {
  _id: string;
  name: string;
  slug: string;
}

interface Skill {
  backgroundColor: string;
  height: number;
  logoPath: string;
  description: string;
}

const experiences = [
  {
    startDate: "2021-10-31",
    endDate: "2022-02-28",
  },
  {
    startDate: "2022-04-01",
    endDate: "2023-11-16",
  },
];

const Home = async () => {
  let projects: Project[] = [];
  let skills: Skill[] = [];

  try {
    const [projectsRes, skillsRes] = await Promise.all([
      fetch("http://localhost:3000/api/projects", {
        next: { revalidate: 60 }, // Cache the response for 60 seconds
      }),
      fetch("http://localhost:3000/api/skills", {
        next: { revalidate: 60 }, // Cache the response for 60 seconds
      }),
    ]);

    if (projectsRes.ok) {
      projects = await projectsRes.json();
    } else {
      console.error("Failed to fetch projects:", projectsRes.statusText);
    }

    if (skillsRes.ok) {
      skills = await skillsRes.json();
    } else {
      console.error("Failed to fetch skills:", skillsRes.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div>
      <Biography
        name="Nabil Belfki"
        role="Software Engineer"
        imagePath="/images/profile.jpg"
        imageAlt="Nabil Belfki"
        biography="There is nothing that I can’t do or accomplish. I’m a great asset to a team and company. I’ve transformed countless clients in my career by helping them automate processes and solve their problems. I’m code agnostic haven write projects in many different stacks. I have knowledge in many different sectors from the flight industry to banking and finance to e-commerce."
      />
      <div id="experiences" className="experience-and-skills">
        <Timeline experiences={experiences} />
        <div id="skills" className="skills-display">
          <div className="skills-title-and-description">
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
        <div className="projects">
          {projects.map((project) => (
            <Link key={project._id} href={`/application/${project._id}`}>
              <Project
                name={project.name}
                videoPath={`/videos/${project.slug}.gif`}
              />
            </Link>
          ))}
        </div>
        {projects.length > 4 && (
          <div className="previous-projects">
            <svg
              viewBox="0 0 9 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 13L2 6.99999L8 1" stroke="#5C5C5C" strokeWidth="2" />
            </svg>
          </div>
        )}
        {projects.length > 4 && (
          <div className="next-projects">
            <svg
              viewBox="0 0 9 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 13L7 6.99999L1 1" stroke="#5C5C5C" strokeWidth="2" />
            </svg>
          </div>
        )}
        {projects.length > 4 && (
          <div className="project-pages">
            <div className="project-page selected-page"></div>
            <div className="project-page"></div>
          </div>
        )}
      </div>
      <div id="contact" className="contact-and-schedule-meeting">
        <ContactForm />
        <div className="title-and-calendar">
          <div className="calendar-title">Schedule a Meeting</div>
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Home;
