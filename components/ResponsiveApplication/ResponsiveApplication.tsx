"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Video from "@/components/Video/Video";
import Views from "@/components/Views/Views";
import Duration from "@/components/Duration/Duration";
import Dates from "@/components/Dates/Dates";
import PictureLink from "@/components/PictureLink/PictureLink";
import Languages from "@/components/Languages/Languages";
import Description from "@/components/Description/Description";
import Slider from "@/components/Slider/Slider";
import Client from "@/components/Client/Client";
import Map from "@/components/Map/Map";
import Calendar from "@/components/Calendar/Calendar";
import Button from "@/components/Button/Button";
import MobileApplication from "@/components/Mobile/Application/Application";
import styles from "./ResponsiveApplication.module.css";
import { Project } from "@/lib/types";

interface ResponsiveApplicationProps {
  project: Project;
}

const ResponsiveApplication: React.FC<ResponsiveApplicationProps> = ({ project }) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    return <MobileApplication project={project} />;
  }

  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Video
          name={project.name}
          videoPath={`/videos/${project.slug}.mp4`}
          thumbnail={project.thumbnail}
        />
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
            <Map location={project.client.location} />
          </div>
          <div className={styles["call-to-action-and-calendar"]}>
            <div className={styles["call-to-action"]}>
              <div className={styles.text}>Have Questions?</div>
              <Link href={`/#contact`}>
                <Button
                  text="CONTACT ME"
                  onClick={() => console.log("Contact me")}
                  style={{ fontWeight: 600, width: 130, backgroundColor: "#2571FF" }}
                />
              </Link>
            </div>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveApplication;
