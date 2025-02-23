"use client";
import React from "react";
import Slider from "../../components/Slider";
import Languages from "../../components/Languages";
import Views from "../../components/Views";
import Duration from "../../components/Duration";
import Dates from "../../components/Dates";
import PictureLink from "../../components/PictureLink";
import Description from "../../components/Description";
import Calendar from "../../components/Calendar";
import Button from "../../components/Button";
import Project from "../../components/Project";
import Map from "../../components/Map";
import Client from "../../components/Client";
import styles from "./Application.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Project as ProjectType } from "../../components/types";

interface ApplicationProps {
  params: Promise<{ id: string }>;
}

const Application: React.FC<ApplicationProps> = ({ params }) => {
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
          setProject(res.data);
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };

      fetchProject();
    }
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);

  console.log("Project", project);

  return (
    <>
      <Project name={project.name} videoPath={`/videos/${project.slug}.gif`} />
      <div className={styles.background}>
        <div className={styles["project-information"]}>
          <div className={styles["views-and-duration"]}>
            <Views views={project.views} />
            <Duration duration={project.duration} />
          </div>
          <div className={styles["dates-and-links"]}>
            <Dates start={startDate} end={endDate} />
            <div className={styles["links"]}>
              <PictureLink
                image={"/images/github-logo.svg"}
                shortLink={project.repository.shortUrl}
                link={project.repository.url}
                name={"Repository"}
                color={"#2E2E2E"}
              />
              <PictureLink
                image={"/images/docker.svg"}
                shortLink={project.container.shortUrl}
                link={project.container.url}
                name={"Container"}
                color={"#127EC0"}
              />
            </div>
          </div>
          <div className={styles.languages}>
            <Languages languages={project.languages} />
          </div>
        </div>
        <Description text={project.description} url={project.url} />
        <Slider slides={project.tools} />
        <div className={styles["client-info-and-contact"]}>
          <div className={styles.client}>
            <Client client={project.client} />
            <Map />
          </div>
          <div className={styles["call-to-action-and-calendar"]}>
            <div className={styles["call-to-action"]}>
              <div className={styles.text}>Have Questions?</div>
              <Button
                text="CONTACT ME"
                onClick={() => console.log("Contact me")}
                style={{ fontWeight: 600, width: 130 }}
              />
            </div>
            <Calendar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Application;
