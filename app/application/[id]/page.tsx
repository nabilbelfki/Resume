"use client";
import React from "react";
import Link from "next/link";
import ResponsiveApplication from "@/components/ResponsiveApplication/ResponsiveApplication";
import axios from "axios";
import { useEffect, useState } from "react";
import { Project as ProjectType } from "../../../lib/types";
import { useRouter, notFound } from 'next/navigation';

interface ApplicationProps {
  params: Promise<{ id: string }>;
}

const Application: React.FC<ApplicationProps> = ({ params }) => {
  const router = useRouter();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setId(unwrappedParams.id);
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const res = await axios.get(`/api/projects/${id}`);

          // Check if project status is not Active
          if (res.data.status !== 'Active') {
            notFound();
            return; // Exit early to prevent setting state
          }

          setProject(res.data);
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };

      fetchProject();
    }
  }, [id, router]);

  if (!project) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <h2 style={{ color: '#888', fontWeight: 300, fontSize: '24px' }}>Loading...</h2>
      </div>
    );
  }

  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);

  console.log("Project", project);

  return <ResponsiveApplication project={project} />;
};

export default Application;
