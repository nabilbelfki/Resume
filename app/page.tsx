import React from "react";
import { Experiences, Project, Skill } from "../lib/types";
import ResponsiveHome from "@/components/ResponsiveHome/ResponsiveHome";

const Home = async () => {
  let projects: Project[] = [];
  let skills: Skill[] = [];
  let experiences: Experiences[] = [];
  let settings = {
    siteMaintenance: false,
    websiteMessaging: true, // Default open 
    scheduleMeetings: true
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  try {
    const [projectsRes, skillsRes, experiencesRes, settingsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/projects?status=Active`, { 
        next: { revalidate: 60 },
      }),
      fetch(`${API_BASE_URL}/api/skills?status=Active`, { 
        next: { revalidate: 60 },
      }),
      fetch(`${API_BASE_URL}/api/experiences?status=Active`, { 
        next: { revalidate: 60 },
      }),
      fetch(`${API_BASE_URL}/api/settings`, {
        cache: 'no-store'
      }),
    ]);

    if (projectsRes.ok) {
      const projectsData = await projectsRes.json();
      projects = projectsData.data;
    }

    if (skillsRes.ok) {
      const skillsData = await skillsRes.json();
      skills = skillsData.data;
    }

    if (experiencesRes.ok) {
      const experiencesData = await experiencesRes.json();
      experiences = experiencesData.data;
    }

    if (settingsRes.ok) {
      const settingsData = await settingsRes.json();
      if (settingsData.data) {
        settings = settingsData.data;
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <ResponsiveHome 
      projects={projects}
      skills={skills}
      experiences={experiences}
      settings={settings}
    />
  );
};

export default Home;
