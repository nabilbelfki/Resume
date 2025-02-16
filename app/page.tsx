import Link from "next/link";
import React from "react";
import Image from "next/image";
import Biography from "./components/Biography";
import Timeline from "./components/Timeline";
import ContactForm from "./components/ContactForm";
import Calendar from "./components/Calendar";
import Skills from "./components/Skills";
import Project from "./components/Project";

interface Project {
  _id: string;
  name: string;
  slug: string;
}

interface Image {
  name: string;
  url: string;
  backgroundColor: string;
  height: number;
  width: number;
}

interface Description {
  color: string;
  text: string;
  backgroundColor: string;
}

interface Skill {
  name: string;
  type: string;
  image: Image;
  description: Description;
}

const experiences = [
  {
    level: 1,
    zIndex: 1,
    name: "American College of Thessaloniki",
    location: "Thessaloniki, Greece",
    type: "Education",
    logo: {
      opened: {
        name: "act.svg",
        width: 75,
        height: 75
      },
      closed: {
        name: "act.svg",
        width: 130,
        height: 130
      }
    },
    title: "Bachelors of Science",
    subtitle: "Business and Computing",
    period: {
      title: "June 2021",
      start: "2017-01-01",
      end: "2021-06-16"
    },
    color: {
      line: "#870404",
      name: "#2E2E2E",
      title: "#FFFFFF",
      subtitle: "#FFFFFF",
      type: "#FFFFFF",
      date: "#870404",
      location: "rgba(46,46,46,0.7)",
      background: "#FFFFFF",
      details: "#870404",
      description: {
        text: "#FFFFFF",
        background: "rgba(255,255,255,0.3)"
      }
    },
    description: "I began my education aboard after having moved from United States to Greece. Here is where I fell in love with technology and began sharpening my skills. I broadened my understanding of various areas of Business and Computing during my Bachelors of Science Degree here."
  },
  {
    level: 1,
    zIndex: 2,
    name: "theCoderSchool",
    location: "Belle Mead, NJ",
    type: "Work",
    logo: {
      opened: {
        name: "the-coder-school.png",
        width: 75,
        height: 75
      },
      closed: {
        name: "the-coder-school.png",
        width: 130,
        height: 130
      }
    },
    title: "Programming Instructor",
    period: {
      title: "March - August 2022",
      start: "2021-07-01",
      end: "2022-08-01"
    },
    color: {
      line: "#10C810",
      name: "#2E2E2E",
      title: "#10C810",
      type: "#10C810",
      date: "#FFFFFF",
      location: "rgba(46,46,46,0.7)",
      background: "#10C810",
      details: "#FFFFFF",
      description: {
        text: "#2E2E2E",
        background: "rgba(0,0,0,0.1)"
      }
    },
    description: "Helping K-12 learn to code solidified my understanding further. Seeing their learning process was insightful. Here I learned the importance of projects compared to just teaching them to code. Building a project makes you realize the potential and why we code in the first place."
  },
  {
    level: 2,
    zIndex: 3,
    name: "New Jersey Institute of Technology",
    location: "Newark, NJ",
    type: "Education",
    logo: {
      opened: {
        name: "njit.png",
        width: 75,
        height: 75
      },
      closed: {
        name: "njit.png",
        width: 130,
        height: 130
      }
    },
    title: "Masters of Science",
    subtitle: "Computer Science",
    period: {
      title: "September 2022-Present",
      start: "2022-09-01",
    },
    color: {
      line: "#C30000",
      name: "#2E2E2E",
      title: "#C30000",
      subtitle: "#C30000",
      type: "#C30000",
      date: "#FFFFFF",
      location: "rgba(46,46,46,0.7)",
      background: "#C30000",
      details: "#FFFFFF",
      description: {
        text: "#2E2E2E",
        background: "rgba(0,0,0,0.1)"
      }
    },
    description: "Helping K-12 learn to code solidified my understanding further. Seeing their learning process was insightful. Here I learned the importance of projects compared to just teaching them to code. Building a project makes you realize the potential and why we code in the first place."
  },
  {
    level: 1,
    zIndex: 4,
    name: "Cole Solutions LLC",
    location: "Piscataway, NJ",
    type: "Work",
    logo: {
      opened: {
        name: "cole-solutions-2.svg",
        width: 75,
        height: 75
      },
      closed: {
        name: "cole-solutions-1.svg",
        width: 130,
        height: 130
      }
    },
    title: "Software Developer",
    period: {
      title: "September 2022-Present",
      start: "2022-09-01",
      // end: "2024-09-01"
    },
    color: {
      line: "#0898DA",
      name: "#223E60",
      title: "#FFFFFF",
      type: "#FFFFFF",
      date: "#0898DA",
      location: "#223E60",
      background: "#FFFFFF",
      details: "#0898DA",
      description: {
        text: "#FFFFFF",
        background: "rgba(255,255,255,0.3)"
      }
    },
    description: "Helping K-12 learn to code solidified my understanding further. Seeing their learning process was insightful. Here I learned the importance of projects compared to just teaching them to code. Building a project makes you realize the potential and why we code in the first place."
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
