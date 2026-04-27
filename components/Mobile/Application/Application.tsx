"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FullPageTransition from "@/components/FullPageTransition/FullPageTransition";
import Video from "@/components/Mobile/Video/Video";
import Views from "@/components/Mobile/Views/Views";
import Duration from "@/components/Mobile/Duration/Duration";
import Dates from "@/components/Mobile/Dates/Dates";
import PictureLink from "@/components/Mobile/PictureLink/PictureLink";
import Languages from "@/components/Mobile/Languages/Languages";
import Description from "@/components/Mobile/Description/Description";
import Slider from "@/components/Mobile/Slider/Slider";
import Client from "@/components/Mobile/Client/Client";
import Map from "@/components/Mobile/Map/Map";
import Calendar from "@/components/Mobile/Calendar/Calendar";
import Button from "@/components/Mobile/Button/Button";
import styles from "./Application.module.css";
import { Project } from "@/lib/types";
import Slideshow from "../Slideshow/Slideshow";

interface ApplicationProps {
  project: Project;
}

const MobileApplication: React.FC<ApplicationProps> = ({ project }) => {
  const [activeSection, setActiveSection] = useState<string>("project-details");
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);

  useEffect(() => {
    const handleSectionFocused = (e: any) => {
      setActiveSection(e.detail.id);
    };
    window.addEventListener('section-focused', handleSectionFocused);
    return () => window.removeEventListener('section-focused', handleSectionFocused);
  }, []);

  const videoSlides = ["project-details", "project-description", "project-tools", "project-client"];
  const showVideo = videoSlides.includes(activeSection);

  const VisitSiteButton = () => (
    <div className={styles.visitButtonContainer}>
      <Button
        text="VISIT SITE"
        onClick={() => window.open(project.url, "_blank")}
        style={{ width: "100%", height: 50, fontWeight: 600, fontSize: 16, backgroundColor: "#2571FF" }}
      />
    </div>
  );

  return (
    <div className={styles.application}>
      {/* Sticky Video Section */}
      {showVideo && (
        <div className={styles.stickyVideo}>
          <Video
            name={project.name}
            videoPath={`/videos/${project.slug}.mp4`}
            thumbnail={project.thumbnail}
          />
        </div>
      )}

      <FullPageTransition>
        {/* Slide 1: Project Details */}
        <div id="project-details" className={`snap-section ${styles.slide}`}>
          <div className={styles.videoPlaceholder}></div>
          <div className={styles.scrollContent}>
            <div className={styles.viewsDurationRow}>
              <Views views={project.views} />
              <Duration duration={project.duration} />
            </div>
            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
              <div className={styles.infoCard}>
                <Dates start={startDate} end={endDate} />
              </div>
            </div>
            <div className={styles.infoCard}>
              <Languages languages={project.languages} />
            </div>
            <div className={styles.linksRow}>
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
          <VisitSiteButton />
        </div>

        {/* Slide 2: Project Description */}
        <div id="project-description" className={`snap-section ${styles.slide}`}>
          <div className={styles.videoPlaceholder}></div>
          <div className={styles.scrollContent} style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 100 }}>
            <div className={styles.infoCard} style={{ padding: 0, flex: 1 }}>
              <Description text={project.description} url={project.url} hideButton />
            </div>
          </div>
          <VisitSiteButton />
        </div>

        {/* Slide 3: Project Tools */}
        <div id="project-tools" className={`snap-section ${styles.slide}`}>
          <div className={styles.videoPlaceholder}></div>
          <div className={styles.scrollContent}>
            <div className={styles.infoCard} style={{ paddingTop: 30 }}>
              <Slider slides={project.tools} />
            </div>
          </div>
          <VisitSiteButton />
        </div>

        {/* Slide 4: Confirmation (Client Info) */}
        <div id="project-client" className={`snap-section ${styles.slide} ${styles.fullHeightSlide}`}>
          <div className={styles.videoPlaceholder}></div>
          <div className={styles.scrollContent}>
            <Client client={project.client} />
          </div>
          <VisitSiteButton />
        </div>

        {/* Slide 5: Confirmation (Client Image) */}
        {project.client.slides && project.client.slides.length > 0 && (
          <div id="project-client-image" className={`snap-section ${styles.slide} ${styles.fullHeightSlide} ${styles.graySlide}`}>
            <div className={styles.slide5Card}>
              <div className={styles.clientSlideHeader}>
                <img
                  src={`${project.client.logo.path}${project.client.logo.fileName}`}
                  alt="Client Logo"
                  width={30}
                  height={30}
                />
                <span className={styles.clientHeaderTitle}>{project.client.title.name}</span>
              </div>
              <div className={styles.slideshowSlide}>
                <Slideshow slides={project.client.slides} />
              </div>
            </div>
          </div>
        )}

        {/* Slide 6: Confirmation (Map) */}
        <div id="project-map" className={`snap-section ${styles.slide} ${styles.fullHeightSlide}`}>
          <div className={styles.confirmationTitle}>Confirmation</div>
          <div className={styles.mapContainer}>
            <Map location={project.client.location} />
          </div>
        </div>

        {/* Slide 7: Contact */}
        <div id="project-contact" className={`snap-section ${styles.slide} ${styles.contactSlide}`}>
          <div className={styles.scrollContent}>
            <div className={styles.contactContainer}>
              <div className={styles.contactHeader}>Have Questions?</div>
              <Link href="/#contact">
                <Button
                  text="CONTACT ME"
                  onClick={() => { }}
                  style={{ width: 200, height: 45, fontWeight: 600, backgroundColor: "#2571FF" }}
                />
              </Link>
            </div>
            <Calendar />
          </div>
        </div>
      </FullPageTransition>
    </div>
  );
};

export default MobileApplication;
