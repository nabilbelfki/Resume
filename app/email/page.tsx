"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AddCalendar from "../components/AddCalendar";
import Confirmation from "../components/Confirmation";
import Project from "../components/Project";
import CancelMeeting from "../components/CancelMeeting";
import styles from "./Email.module.css";

const EmailContent: React.FC = () => {
  const searchParams = useSearchParams();

  // Check if searchParams is null
  const firstName = searchParams?.get("firstName") || "";
  const lastName = searchParams?.get("lastName") || "";
  const date = searchParams?.get("date") || "";

  return (
    <div className={styles.background}>
      <Confirmation
        firstName={firstName}
        lastName={lastName}
        dateTime={new Date(date)}
      />
      <div className={styles.content}>
        <div className={styles["add-calendar-and-cancel-meeting"]}>
          <AddCalendar dateTime={new Date(date)} />
          <CancelMeeting firstName={firstName} lastName={lastName} dateTimeString={date} />
        </div>
        <div className={styles["project-preview"]}>
          <Link key="67a2432855f8ecd625cc5ea5" href={`/#biography`}>
            <Project
              name="Personal Website"
              videoPath={`/videos/personal.gif`}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Email: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailContent />
    </Suspense>
  );
};

export default Email;
